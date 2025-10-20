from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required
from app.utils.decorators import admin_required
from app.extensions import db
from app.models.product import Product
from app.models.category import Category
from typing import Tuple

bp = Blueprint('products', __name__, url_prefix='/products')


@bp.route('/', methods=['GET'])
def get_products() -> Tuple[Response, int]:
    """
    Get all products
    ---
    tags:
      - Products
    responses:
      200:
        description: List of all products
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
                    example: "Laptop HP Pavilion"
                  description:
                    type: string
                    example: "Laptop de alto rendimiento con 16GB RAM"
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
    """
    products: list[Product] = Product.query.all()
    return jsonify([product.to_dict() for product in products]), 200


@bp.route('/<int:id>', methods=['GET'])
def get_product(id: int) -> Tuple[Response, int]:
    """
    Get a specific product by ID
    ---
    tags:
      - Products
    parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
        description: Unique product identifier
        example: 1
    responses:
      200:
        description: Product details
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
                  example: "Laptop HP Pavilion"
                description:
                  type: string
                  example: "Laptop de alto rendimiento con 16GB RAM"
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
        description: Product not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Producto no encontrado"
    """
    product: Product | None = Product.query.get(id)

    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404

    return jsonify(product.to_dict()), 200


@bp.route('/', methods=['POST'])
@jwt_required()
@admin_required()
def create_product() -> Tuple[Response, int]:
    """
    Create a new product
    ---
    tags:
      - Products
    security:
      - Bearer: []
    requestBody:
      required: true
      description: Product data
      content:
        application/json:
          schema:
            type: object
            required:
              - name
              - price
            properties:
              name:
                type: string
                minLength: 1
                maxLength: 200
                description: Product name
                example: "Laptop HP Pavilion"
              description:
                type: string
                description: Detailed product description
                example: "Laptop de alto rendimiento con 16GB RAM y SSD 512GB"
              price:
                type: number
                format: float
                minimum: 0.01
                description: Product price in dollars
                example: 899.99
              stock:
                type: integer
                minimum: 0
                default: 0
                description: Available stock quantity
                example: 25
              category_id:
                type: integer
                description: Category identifier (must exist)
                example: 1
              image_url:
                type: string
                format: uri
                description: URL to product image
                example: "https://example.com/images/laptop.jpg"
    responses:
      201:
        description: Product created successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Producto creado correctamente"
                product:
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
                      example: "Laptop de alto rendimiento con 16GB RAM"
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
                      example: "https://example.com/images/laptop.jpg"
                    created_at:
                      type: string
                      format: date-time
                      example: "2025-10-20T10:30:00.000000"
      400:
        description: Missing required fields or category not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Faltan campos para poder crear el producto"
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
    data: dict = request.get_json()

    if not data or not data.get('name') or not data.get('price'):
        return jsonify({'error': 'Faltan campos para poder crear el producto'}), 400

    if data.get('category_id'):
        category: Category | None = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'error': 'Categoria no encontrada'}), 404

    product: Product = Product(
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
@admin_required()
def update_product(id: int) -> Tuple[Response, int]:
    """
    Update an existing product
    ---
    tags:
      - Products
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
        description: Product ID to update
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
                maxLength: 200
                example: "Laptop HP Pavilion Updated"
              description:
                type: string
                example: "Nueva descripción del producto"
              price:
                type: number
                format: float
                minimum: 0.01
                example: 799.99
              stock:
                type: integer
                minimum: 0
                example: 30
              category_id:
                type: integer
                example: 2
              image_url:
                type: string
                format: uri
                example: "https://example.com/images/laptop-new.jpg"
    responses:
      200:
        description: Product updated successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Producto actualizado correctamente"
                product:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    name:
                      type: string
                      example: "Laptop HP Pavilion Updated"
                    description:
                      type: string
                      example: "Nueva descripción del producto"
                    price:
                      type: number
                      format: float
                      example: 799.99
                    stock:
                      type: integer
                      example: 30
                    category_id:
                      type: integer
                      example: 2
                    image_url:
                      type: string
                      example: "https://example.com/images/laptop-new.jpg"
                    created_at:
                      type: string
                      format: date-time
                      example: "2025-10-20T10:30:00.000000"
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
        description: Product not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No se encontro el producto con id 1"
    """
    product: Product | None = Product.query.get(id)

    if not product:
        return jsonify({'error': f'No se encontro el producto con id {id}'}), 404

    data: dict = request.get_json()

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
@admin_required()
def delete_product(id: int) -> Tuple[Response, int]:
    """
    Delete a product
    ---
    tags:
      - Products
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
        description: Product ID to delete
        example: 1
    responses:
      200:
        description: Product deleted successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Producto eliminado correctamente"
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
        description: Product not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No se encontro el producto con id 1"
    """
    product: Product | None = Product.query.get(id)

    if not product:
        return jsonify({'error': f'No se encontro el producto con id {id}'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Producto eliminado correctamente'}), 200
