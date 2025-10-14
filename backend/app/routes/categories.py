from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required
from app.utils.decorators import admin_required
from app.extensions import db
from app.models.category import Category
from app.models.product import Product
from typing import Tuple


bp = Blueprint('categories', __name__, url_prefix='/categories')


@bp.route('/', methods=['GET'])
def get_categories() -> Tuple[Response, int]:
    """
    Get all categories
    ---
    tags:
      - Categories
    responses:
      200:
        description: List of all categories
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
              description:
                type: string
    """
    categories: list[Category] = Category.query.all()
    return jsonify([category.to_dict() for category in categories]), 200


@bp.route('/<int:id>', methods=['GET'])
def get_category(id: int) -> Tuple[Response, int]:
    """
    Get a specific category by ID
    ---
    tags:
      - Categories
    parameters:
      - in: path
        name: id
        type: integer
        required: true
        description: Category ID
    responses:
      200:
        description: Category details
        schema:
          type: object
          properties:
            id:
              type: integer
            name:
              type: string
            description:
              type: string
      404:
        description: Category not found
        schema:
          type: object
          properties:
            error:
              type: string
    """
    category: Category | None = Category.query.get(id)

    if not category:
        return jsonify({'error': f'Categoria con id {id} no encontrada'}), 404

    return jsonify(category.to_dict()), 200


@bp.route('/<int:id>/products', methods=['GET'])
def get_category_products(id: int) -> Tuple[Response, int]:
    """
    Get all products in a specific category
    ---
    tags:
      - Categories
    parameters:
      - in: path
        name: id
        type: integer
        required: true
        description: Category ID
    responses:
      200:
        description: Category with its products
        schema:
          type: object
          properties:
            category:
              type: object
              properties:
                id:
                  type: integer
                name:
                  type: string
                description:
                  type: string
            products:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  description:
                    type: string
                  price:
                    type: number
                  stock:
                    type: integer
                  category_id:
                    type: integer
                  image_url:
                    type: string
      404:
        description: Category not found
        schema:
          type: object
          properties:
            error:
              type: string
    """
    category: Category | None = Category.query.get(id)

    if not category:
        return jsonify({'error': f'Categoria con id {id} no encontrada'}), 404

    products: list[Product] = Product.query.filter_by(category_id=id).all()

    return jsonify({
        'category': category.to_dict(),
        'products': [product.to_dict() for product in products]
    }), 200


@bp.route('/', methods=['POST'])
@jwt_required()
@admin_required()
def create_category() -> Tuple[Response, int]:
    """
    Create a new category
    ---
    tags:
      - Categories
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
          properties:
            name:
              type: string
            description:
              type: string
    responses:
      201:
        description: Category created successfully
        schema:
          type: object
          properties:
            message:
              type: string
            category:
              type: object
              properties:
                id:
                  type: integer
                name:
                  type: string
                description:
                  type: string
      400:
        description: Missing required fields
        schema:
          type: object
          properties:
            error:
              type: string
      403:
        description: Admin permission required
        schema:
          type: object
          properties:
            msg:
              type: string
      409:
        description: Category already exists
        schema:
          type: object
          properties:
            error:
              type: string
    """
    data: dict = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'error': 'Es necesario un nombre'}), 400

    exist: Category | None = Category.query.filter_by(
        name=data['name']).first()
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
@admin_required()
def update_category(id: int) -> Tuple[Response, int]:
    """
    Update an existing category
    ---
    tags:
      - Categories
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        type: integer
        required: true
        description: Category ID
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            description:
              type: string
    responses:
      200:
        description: Category updated successfully
        schema:
          type: object
          properties:
            message:
              type: string
            category:
              type: object
              properties:
                id:
                  type: integer
                name:
                  type: string
                description:
                  type: string
      400:
        description: No data received for update
        schema:
          type: object
          properties:
            error:
              type: string
      403:
        description: Admin permission required
        schema:
          type: object
          properties:
            msg:
              type: string
      404:
        description: Category not found
        schema:
          type: object
          properties:
            error:
              type: string
      409:
        description: Category name already exists
        schema:
          type: object
          properties:
            error:
              type: string
    """
    category: Category | None = Category.query.get(id)

    if not category:
        return jsonify({'error': f'Categoria con id {id} no encontrada'}), 404

    data: dict = request.get_json()
    if not data:
        return jsonify({'error': 'No se recibieron datos para actualizar'}), 400

    if 'name' in data:
        exist: Category | None = Category.query.filter_by(
            name=data['name']).first()
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
@admin_required()
def delete_category(id: int) -> Tuple[Response, int]:
    """
    Delete a category
    ---
    tags:
      - Categories
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        type: integer
        required: true
        description: Category ID
    responses:
      200:
        description: Category deleted successfully
        schema:
          type: object
          properties:
            message:
              type: string
      400:
        description: Cannot delete category with associated products
        schema:
          type: object
          properties:
            error:
              type: string
      403:
        description: Admin permission required
        schema:
          type: object
          properties:
            msg:
              type: string
      404:
        description: Category not found
        schema:
          type: object
          properties:
            error:
              type: string
    """
    category: Category | None = Category.query.get(id)

    if not category:
        return jsonify({'error': 'Categoria no encontrada'}), 404

    products_count: int = Product.query.filter_by(category_id=id).count()
    if products_count > 0:
        return jsonify({
            'error': f'No se puede eliminar. Hay {products_count} producto(s) asociados a esta categoria'
        }), 400

    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Categoria eliminada correctamente'}), 200
