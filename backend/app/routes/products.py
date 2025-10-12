from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.product import Product
from app.models.category import Category

bp = Blueprint('products', __name__, url_prefix='/products')


@bp.route('/', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products]), 200


@bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)

    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404

    return jsonify(product.to_dict()), 200


@bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json()

    if not data or not data.get('name') or not data.get('price'):
        return jsonify({'error': 'Faltan campos para poder crear el producto'}), 400

    if data.get('category_id'):
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'error': 'Categoria no encontrada'}), 404

    product = Product(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        stock=data.get('stock', 0),
        image_url=data.get('image_url'),
        category_id=data.get('category_id')
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        'message': 'Producto creado correctamente',
        'product': product.to_dict()
    }), 201


@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    product = Product.query.get(id)

    if not product:
        return jsonify({'error': f'No se encontro el producto con id {id}'}), 404

    data = request.get_json()

    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'stock' in data:
        product.stock = data['stock']
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'category_id' in data:
        product.category_id = data['category_id']

    db.session.commit()

    return jsonify({
        'message': 'Producto actualizado correctamente',
        'product': product.to_dict()
    }), 200


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    product = Product.query.get(id)

    if not product:
        return jsonify({'error': f'No se encontro el producto con id {id}'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Producto eliminado correctamente'}), 200
