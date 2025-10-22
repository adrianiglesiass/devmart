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
    requestBody:
      required: true
      description: User registration data
      content:
        application/json:
          schema:
            type: object
            required:
              - username
              - email
              - password
            properties:
              username:
                type: string
                minLength: 3
                maxLength: 80
                description: Unique username for the account
                example: "john_doe"
              email:
                type: string
                format: email
                minLength: 5
                maxLength: 120
                description: Valid email address
                example: "john.doe@example.com"
              password:
                type: string
                minLength: 6
                maxLength: 128
                description: Password with at least 6 characters
                example: "securePassword123"
    responses:
      201:
        description: User registered successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Usuario creado exitosamente"
                access_token:
                  type: string
                  description: JWT access token for authenticated requests
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                user:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    username:
                      type: string
                      example: "john_doe"
                    email:
                      type: string
                      example: "john.doe@example.com"
                    role:
                      type: string
                      enum: [customer, admin]
                      example: "customer"
                    created_at:
                      type: string
                      format: date-time
                      example: "2025-10-20T10:30:00.000000"
      400:
        description: Missing required fields
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Faltan campos requeridos"
      409:
        description: Username or email already exists
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Este usuario ya existe"
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

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': 'Usuario creado exitosamente',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201


@bp.route('/login', methods=['POST'])
def login() -> Tuple[Response, int]:
    """
    Authenticate user and get access token
    ---
    tags:
      - Authentication
    requestBody:
      required: true
      description: User credentials
      content:
        application/json:
          schema:
            type: object
            required:
              - email
              - password
            properties:
              email:
                type: string
                format: email
                description: User's email address
                example: "john.doe@example.com"
              password:
                type: string
                description: User's password
                example: "securePassword123"
    responses:
      200:
        description: User authenticated successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Usuario identificado correctamente"
                access_token:
                  type: string
                  description: JWT access token for authenticated requests
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                user:
                  type: object
                  properties:
                    id:
                      type: integer
                      example: 1
                    username:
                      type: string
                      example: "john_doe"
                    email:
                      type: string
                      example: "john.doe@example.com"
                    role:
                      type: string
                      enum: [customer, admin]
                      example: "customer"
                    created_at:
                      type: string
                      format: date-time
                      example: "2025-10-20T10:30:00.000000"
      400:
        description: Missing email or password
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Email y contraseña requeridos"
      401:
        description: Invalid credentials
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "La contraseña introducida no es correcta"
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
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                username:
                  type: string
                  example: "john_doe"
                email:
                  type: string
                  format: email
                  example: "john.doe@example.com"
                role:
                  type: string
                  enum: [customer, admin]
                  example: "customer"
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
      404:
        description: User not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Usuario no encontrado"
    """
    user_id: int = int(get_jwt_identity())
    user: User | None = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify(user.to_dict()), 200
