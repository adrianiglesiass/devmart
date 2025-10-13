from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from typing import Tuple

bp = Blueprint('orders', __name__, url_prefix='/orders')


@bp.route('/', methods=['GET'])
@jwt_required()
def get_user_orders() -> Tuple[Response, int]:
    user_id: int = int(get_jwt_identity())

    orders: list[Order] = Order.query.filter_by(
        user_id=user_id).order_by(Order.created_at.desc()).all()

    return jsonify([order.to_dict() for order in orders]), 200


@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id: int) -> Tuple[Response, int]:
    user_id: int = int(get_jwt_identity())
    order: Order | None = Order.query.get(id)

    if not order:
        return jsonify({'error': 'No se encontro ese pedido'}), 404

    if order.user_id != user_id:
        return jsonify({'error': 'No tienes permiso para este pedido'}), 403

    return jsonify(order.to_dict()), 200


@bp.route('/', methods=['POST'])
@jwt_required()
def create_order() -> Tuple[Response, int]:
    user_id: int = int(get_jwt_identity())
    data: dict = request.get_json()

    if not data or not data.get('items') or len(data['items']) == 0:
        return jsonify({'error': 'El pedido debe tener m\u00ednimo un producto'}), 400

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
    order: Order | None = Order.query.get(id)

    if not order:
        return jsonify({'error': 'Pedido no encontrado'}), 404

    data: dict = request.get_json()

    if not data or not data.get('status'):
        return jsonify({'error': 'El campo status es requerido'}), 400

    valid_statuses: list[str] = ['pending', 'processing',
                                 'shipped', 'delivered', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'error': f'Estado inv\u00e1lido. Valores permitidos: {", ".join(valid_statuses)}'}), 400

    order.status = data['status']
    db.session.commit()

    return jsonify({
        'message': 'Estado del pedido actualizado',
        'order': order.to_dict()
    }), 200


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def cancel_order(id: int) -> Tuple[Response, int]:
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
