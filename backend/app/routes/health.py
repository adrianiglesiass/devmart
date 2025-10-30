from flask import Blueprint, jsonify

bp = Blueprint('health', __name__)


@bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'message': 'DevMart Backend is running'
    }), 200


@bp.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'name': 'DevMart API',
        'version': '1.0.0',
        'status': 'operational',
        'endpoints': {
            'health': '/health',
            'docs': '/docs',
            'categories': '/categories',
            'products': '/products',
            'auth': '/auth'
        }
    }), 200
