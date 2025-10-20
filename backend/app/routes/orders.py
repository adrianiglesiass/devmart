from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.decorators import admin_required
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from typing import Tuple

bp = Blueprint('orders', __name__, url_prefix='/orders')


@bp.route('/', methods=['GET'])
@jwt_required()
def get_user_orders() -> Tuple[Response, int]:
    """
    Get all orders for the authenticated user
    ---
    tags:
      - Orders
    security:
      - Bearer: []
    responses:
      200:
        description: List of user orders
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
                  user_id:
                    type: integer
                    example: 1
                  total:
                    type: number
                    format: float
                    example: 149.99
                  status:
                    type: string
                    enum: [pending, processing, shipped, delivered, cancelled]
                    example: "pending"
                  created_at:
                    type: string
                    format: date-time
                    example: "2025-10-20T10:30:00.000000"
                  items:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                          example: 1
                        product_id:
                          type: integer
                          example: 1
                        quantity:
                          type: integer
                          example: 2
                        price:
                          type: number
                          format: float
                          example: 74.99
                        subtotal:
                          type: number
                          format: float
                          example: 149.98
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
    """
    user_id: int = int(get_jwt_identity())

    orders: list[Order] = Order.query.filter_by(
        user_id=user_id).order_by(Order.created_at.desc()).all()

    return jsonify([order.to_dict() for order in orders]), 200


@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id: int) -> Tuple[Response, int]:
    """
    Get a specific order by ID
    ---
    tags:
      - Orders
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
        description: Order ID
        example: 1
    responses:
      200:
        description: Order details
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                user_id:
                  type: integer
                  example: 1
                total:
                  type: number
                  format: float
                  example: 149.99
                status:
                  type: string
                  enum: [pending, processing, shipped, delivered, cancelled]
                  example: "pending"
                created_at:
                  type: string
                  format: date-time
                  example: "2025-10-20T10:30:00.000000"
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        example: 1
                      product_id:
                        type: integer
                        example: 1
                      quantity:
                        type: integer
                        example: 2
                      price:
                        type: number
                        format: float
                        example: 74.99
                      subtotal:
                        type: number
                        format: float
                        example: 149.98
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
        description: Permission denied for this order
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No tienes permiso para este pedido"
      404:
        description: Order not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No se encontro ese pedido"
    """
    user_id: int = int(get_jwt_identity())
    order: Order | None = Order.query.get(id)

    if not order:
        return jsonify({'error': 'No se encontro ese pedido'}), 404

    if order.user_id != user_id:
        return jsonify({'error': 'No tienes permiso para este pedido'}), 403

    return jsonify(order.to_dict()), 200


@bp.route('/', methods=['POST'])
@jwt_required()
@admin_required()
def create_order() -> Tuple[Response, int]:
    """
    Create a new order
    ---
    tags:
      - Orders
    security:
      - Bearer: []
    requestBody:
      required: true
      description: Order data
      content:
        application/json:
          schema:
            type: object
            required:
              - items
            properties:
              items:
                type: array
                minItems: 1
                items:
                  type: object
                  required:
                    - product_id
                    - quantity
                  properties:
                    product_id:
                      type: integer
                      description: ID of the product to order
                      example: 1
                    quantity:
                      type: integer
                      minimum: 1
                      description: Quantity to order
                      example: 2
              status:
                type: string
                enum: [pending, processing, shipped, delivered, cancelled]
                default: pending
                description: Initial order status
                example: "pending"
    responses:
      201:
        description: Order created successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Pedido creado correctamente"
                order:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    user_id:
                      type: integer
                      example: 1
                    total:
                      type: number
                      format: float
                      example: 149.99
                    status:
                      type: string
                      example: "pending"
                    created_at:
                      type: string
                      format: date-time
                      example: "2025-10-20T10:30:00.000000"
                    items:
                      type: array
                      items:
                        type: object
      400:
        description: Invalid order data or insufficient stock
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "El pedido debe tener mínimo un producto"
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
                  example: "Producto con id 1 no encontrado"
      500:
        description: Internal server error
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Error al crear el pedido"
    """
    user_id: int = int(get_jwt_identity())
    data: dict = request.get_json()

    if not data or not data.get('items') or len(data['items']) == 0:
        return jsonify({'error': 'El pedido debe tener mínimo un producto'}), 400

    total: float = 0
    validated_items: list[dict] = []

    for item in data['items']:
        if not item.get('product_id') or not item.get('quantity'):
            return jsonify({'error': 'Cada item debe tener product_id y quantity'}), 400

        product: Product | None = Product.query.get(item['product_id'])

        if not product:
            return jsonify({'error': f"Producto con id {item['product_id']} no encontrado"}), 404

        if product.stock < item['quantity']:
            return jsonify({'error': f'Stock insuficiente para el producto {product.name}'}), 400

        validated_items.append({
            'product': product,
            'quantity': item['quantity'],
            'price': product.price
        })

        total += product.price * item['quantity']

    order: Order = Order(
        user_id=user_id,
        total=total,
        status=data.get('status', 'pending'),
    )

    db.session.add(order)
    db.session.flush()

    for item in validated_items:
        order_item: OrderItem = OrderItem(
            order_id=order.id,
            product_id=item['product'].id,
            quantity=item['quantity'],
            price=item['price']
        )
        db.session.add(order_item)

        item['product'].stock -= item['quantity']

    try:
        db.session.commit()
        return jsonify({
            'message': 'Pedido creado correctamente',
            'order': order.to_dict()
        }), 201
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al crear el pedido'}), 500


@bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(id: int) -> Tuple[Response, int]:
    """
    Update order status
    ---
    tags:
      - Orders
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
        description: Order ID to update
        example: 1
    requestBody:
      required: true
      description: New status for the order
      content:
        application/json:
          schema:
            type: object
            required:
              - status
            properties:
              status:
                type: string
                enum: [pending, processing, shipped, delivered, cancelled]
                description: New order status
                example: "processing"
    responses:
      200:
        description: Order status updated successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Estado del pedido actualizado"
                order:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    user_id:
                      type: integer
                      example: 1
                    total:
                      type: number
                      format: float
                      example: 149.99
                    status:
                      type: string
                      example: "processing"
                    created_at:
                      type: string
                      format: date-time
                      example: "2025-10-20T10:30:00.000000"
      400:
        description: Invalid status or missing data
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "El campo status es requerido"
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
      404:
        description: Order not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Pedido no encontrado"
    """
    order: Order | None = Order.query.get(id)

    if not order:
        return jsonify({'error': 'Pedido no encontrado'}), 404

    data: dict = request.get_json()

    if not data or not data.get('status'):
        return jsonify({'error': 'El campo status es requerido'}), 400

    valid_statuses: list[str] = ['pending', 'processing',
                                 'shipped', 'delivered', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'error': f'Estado inválido. Valores permitidos: {", ".join(valid_statuses)}'}), 400

    order.status = data['status']
    db.session.commit()

    return jsonify({
        'message': 'Estado del pedido actualizado',
        'order': order.to_dict()
    }), 200


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def cancel_order(id: int) -> Tuple[Response, int]:
    """
    Cancel an order and restore stock
    ---
    tags:
      - Orders
    security:
      - Bearer: []
    parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
        description: Order ID to cancel
        example: 1
    responses:
      200:
        description: Order cancelled and stock restored
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Pedido cancelado y stock restaurado"
      400:
        description: Cannot cancel order in current status
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: 'No se puede cancelar un pedido en estado "processing"'
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
        description: Permission denied for this order
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No tienes permiso para cancelar este pedido"
      404:
        description: Order not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Pedido no encontrado"
    """
    user_id: int = int(get_jwt_identity())

    order: Order | None = Order.query.get(id)

    if not order:
        return jsonify({'error': 'Pedido no encontrado'}), 404

    if order.user_id != user_id:
        return jsonify({'error': 'No tienes permiso para cancelar este pedido'}), 403

    if order.status != 'pending':
        return jsonify({'error': f'No se puede cancelar un pedido en estado "{order.status}"'}), 400

    order_items: list[OrderItem] = OrderItem.query.filter_by(
        order_id=order.id).all()
    for item in order_items:
        product: Product | None = Product.query.get(item.product_id)
        if product:
            product.stock += item.quantity

    order.status = 'cancelled'
    db.session.commit()

    return jsonify({'message': 'Pedido cancelado y stock restaurado'}), 200
