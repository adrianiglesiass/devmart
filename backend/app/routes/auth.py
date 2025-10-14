from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from typing import Tuple

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=['POST'])
def register() -> Tuple[Response, int]:
    """
    Register a new user
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - username
            - email
            - password
          properties:
            username:
              type: string
            email:
              type: string
              format: email
            password:
              type: string
              minLength: 6
    responses:
      201:
        description: User registered successfully
        schema:
          type: object
          properties:
            message:
              type: string
            user:
              type: object
              properties:
                id:
                  type: integer
                username:
                  type: string
                email:
                  type: string
                role:
                  type: string
                created_at:
                  type: string
                  format: date-time
      400:
        description: Missing required fields
        schema:
          type: object
          properties:
            error:
              type: string
      409:
        description: Username or email already exists
        schema:
          type: object
          properties:
            error:
              type: string
    """
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
    """
    Authenticate user and get access token
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              format: email
            password:
              type: string
    responses:
      200:
        description: User authenticated successfully
        schema:
          type: object
          properties:
            message:
              type: string
            access_token:
              type: string
            user:
              type: object
              properties:
                id:
                  type: integer
                username:
                  type: string
                email:
                  type: string
                role:
                  type: string
                created_at:
                  type: string
                  format: date-time
      400:
        description: Missing email or password
        schema:
          type: object
          properties:
            error:
              type: string
      401:
        description: Invalid credentials
        schema:
          type: object
          properties:
            error:
              type: string
    """
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
    """
    Get current authenticated user information
    ---
    tags:
      - Authentication
    security:
      - Bearer: []
    responses:
      200:
        description: Current user information
        schema:
          type: object
          properties:
            id:
              type: integer
            username:
              type: string
            email:
              type: string
            role:
              type: string
            created_at:
              type: string
              format: date-time
      401:
        description: Authentication required
        schema:
          type: object
          properties:
            msg:
              type: string
      404:
        description: User not found
        schema:
          type: object
          properties:
            error:
              type: string
    """
    user_id: int = int(get_jwt_identity())
    user: User | None = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify(user.to_dict()), 200
