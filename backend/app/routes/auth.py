from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from typing import Tuple

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=['POST'])
def register() -> Tuple[Response, int]:
    data = request.get_json()

    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Este usuario ya existe'}), 409

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Este email ya existe'}), 409

    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': 'Usuario creado exitosamente',
        'user': user.to_dict()
    }), 201


@bp.route('/login', methods=['POST'])
def login() -> Tuple[Response, int]:
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña requeridos'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'La contraseña introducida no es correcta'}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': 'Usuario identificado correctamente',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@bp.route('/me', methods=['GET'])
@jwt_required()

def get_current_user() -> Tuple[Response, int]:

    user_id: int = int(get_jwt_identity())
    user: User | None = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify(user.to_dict()), 200
