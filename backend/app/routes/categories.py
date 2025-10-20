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
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  name:
                    type: string
                    example: "Electrónica"
                  description:
                    type: string
                    example: "Productos electrónicos y tecnológicos"
                  products:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                          example: 1
                        name:
                          type: string
                          example: "Laptop HP Pavilion"
                        price:
                          type: number
                          format: float
                          example: 899.99
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
        schema:
          type: integer
        required: true
        description: Category unique identifier
        example: 1
    responses:
      200:
        description: Category details
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                name:
                  type: string
                  example: "Electrónica"
                description:
                  type: string
                  example: "Productos electrónicos y tecnológicos"
                products:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        example: 1
                      name:
                        type: string
                        example: "Laptop HP Pavilion"
                      price:
                        type: number
                        format: float
                        example: 899.99
      404:
        description: Category not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Categoria con id 1 no encontrada"
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
        schema:
          type: integer
        required: true
        description: Category ID
        example: 1
    responses:
      200:
        description: Category with its products
        content:
          application/json:
            schema:
              type: object
              properties:
                category:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    name:
                      type: string
                      example: "Electrónica"
                    description:
                      type: string
                      example: "Productos electrónicos y tecnológicos"
                    products:
                      type: array
                      items:
                        type: object
                products:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        example: 1
                      name:
                        type: string
                        example: "Laptop HP Pavilion"
                      description:
                        type: string
                        example: "Laptop de alto rendimiento"
                      price:
                        type: number
                        format: float
                        example: 899.99
                      stock:
                        type: integer
                        example: 25
                      category_id:
                        type: integer
                        example: 1
                      image_url:
                        type: string
                        format: uri
                        example: "https://example.com/images/laptop.jpg"
                      created_at:
                        type: string
                        format: date-time
                        example: "2025-10-20T10:30:00.000000"
      404:
        description: Category not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Categoria con id 1 no encontrada"
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
    requestBody:
      required: true
      description: Category data
      content:
        application/json:
          schema:
            type: object
            required:
              - name
            properties:
              name:
                type: string
                minLength: 1
                maxLength: 100
                description: Unique category name
                example: "Electrónica"
              description:
                type: string
                description: Category description
                example: "Productos electrónicos y tecnológicos"
    responses:
      201:
        description: Category created successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Categoria creada correctamente"
                category:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    name:
                      type: string
                      example: "Electrónica"
                    description:
                      type: string
                      example: "Productos electrónicos y tecnológicos"
                    products:
                      type: array
                      items:
                        type: object
                      example: []
      400:
        description: Missing required fields
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Es necesario un nombre"
      401:
        description: Authentication required
        content:
          application/json:
            schema:
              type: object
              properties:
                msg:
                  type: string
                  example: "Missing Authorization Header"
      403:
        description: Admin permission required
        content:
          application/json:
            schema:
              type: object
              properties:
                msg:
                  type: string
                  example: "Requiere permisos de administrador"
      409:
        description: Category already exists
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Esta categoria ya existe"
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
        schema:
          type: integer
        required: true
        description: Category ID to update
        example: 1
    requestBody:
      required: true
      description: Fields to update (all optional)
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
                minLength: 1
                maxLength: 100
                example: "Tecnología"
              description:
                type: string
                example: "Nueva descripción de la categoría"
    responses:
      200:
        description: Category updated successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Categoria actualizada correctamente"
                category:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    name:
                      type: string
                      example: "Tecnología"
                    description:
                      type: string
                      example: "Nueva descripción de la categoría"
                    products:
                      type: array
                      items:
                        type: object
      400:
        description: No data received for update
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No se recibieron datos para actualizar"
      401:
        description: Authentication required
        content:
          application/json:
            schema:
              type: object
              properties:
                msg:
                  type: string
                  example: "Missing Authorization Header"
      403:
        description: Admin permission required
        content:
          application/json:
            schema:
              type: object
              properties:
                msg:
                  type: string
                  example: "Requiere permisos de administrador"
      404:
        description: Category not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Categoria con id 1 no encontrada"
      409:
        description: Category name already exists
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Esta categoria ya existe"
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
        schema:
          type: integer
        required: true
        description: Category ID to delete
        example: 1
    responses:
      200:
        description: Category deleted successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Categoria eliminada correctamente"
      400:
        description: Cannot delete category with associated products
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No se puede eliminar. Hay 5 producto(s) asociados a esta categoria"
      401:
        description: Authentication required
        content:
          application/json:
            schema:
              type: object
              properties:
                msg:
                  type: string
                  example: "Missing Authorization Header"
      403:
        description: Admin permission required
        content:
          application/json:
            schema:
              type: object
              properties:
                msg:
                  type: string
                  example: "Requiere permisos de administrador"
      404:
        description: Category not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Categoria no encontrada"
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
