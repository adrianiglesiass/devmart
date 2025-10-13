from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.category import Category
from app.models.product import Product


bp = Blueprint('categories', __name__, url_prefix='/categories')


@bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories]), 200


@bp.route('/<int:id>', methods=['GET'])
def get_category(id):
    category: Category = Category.query.get(id)

    if not category:
        return jsonify({'error': f'Categoria con id {id} no encontrada'}), 404

    return jsonify(category.to_dict()), 200


@bp.route('/<int:id>/products', methods=['GET'])
def get_category_products(id):
    category: Category = Category.query.get(id)

    if not category:
        return jsonify({'error': f'Categoria con id {id} no encontrada'}), 404

    products: Product = Product.query.filter_by(category_id=id).all()

    return jsonify({
        'category': category.to_dict(),
        'products': [product.to_dict() for product in products]
    }), 200


@bp.route('/', methods=['POST'])
@jwt_required()
def create_category():
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'error': 'Es necesario un nombre'}), 400

    exist: Category = Category.query.filter_by(name=data['name']).first()
    if exist:
        return jsonify({'error': 'Esta categoria ya existe'}), 409

    category: Category = Category(
        name=data['name'],
        description=data.get('description')
    )

    db.session.add(category)
    db.session.commit()

    return jsonify({
        'message': 'Categoria creada correctamente',
        'category': category.to_dict()
    }), 201


@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_category(id):
    category: Category = Category.query.get(id)

    if not category:
        return jsonify({'error': f'Categoria con id {id} no encontrada'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se recibieron datos para actualizar'}), 400

    if 'name' in data:
        exist: Category = Category.query.filter_by(name=data['name']).first()
        if exist and exist.id != id:
            return jsonify({'error': 'Esta categoria ya existe'}), 409
        category.name = data['name']

    if 'description' in data:
        category.description = data['description']

    db.session.commit()

    return jsonify({
        'message': 'Categoria actualizada correctamente',
        'category': category.to_dict()
    }), 200


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    category: Category = Category.query.get(id)

    if not category:
        return jsonify({'error': 'Categoria no encontrada'}), 404

    products_count = Product.query.filter_by(category_id=id).count()
    if products_count > 0:
        return jsonify({
            'error': f'No se puede eliminar. Hay {products_count} producto(s) asociados a esta categoria'
        }), 400

    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Categoria eliminada correctamente'}), 200
