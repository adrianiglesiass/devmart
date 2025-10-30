from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from app.extensions import db, jwt, migrate
from app.config import config


def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # CORS configuration
    cors_origins = [
        "http://localhost:5173",      # Vite dev server
        "http://localhost:3000",      # Alternative dev
        # Production frontend (Netlify)
        "https://devmart-frontend.netlify.app",
        "https://devmart-frontend.vercel.app",   # Production frontend (Vercel)
    ]
    CORS(app, resources={
        r"/api/*": {"origins": cors_origins},
        r"/*": {"origins": cors_origins}
    })

    swagger_config = {
        "headers": [],
        "specs": [{
            "endpoint": 'apispec',
            "route": '/apispec.json',
        }],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/docs",
        "openapi": "3.0.0"
    }

    swagger_template = {
        "info": {
            "title": "DevMart API",
            "description": "E-commerce REST API with JWT authentication and role-based access control",
            "version": "1.0.0"
        },
        "components": {
            "securitySchemes": {
                "Bearer": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT",
                    "description": "JWT Authorization header using Bearer scheme"
                }
            }
        },
        "security": [{"Bearer": []}]
    }

    Swagger(app, config=swagger_config, template=swagger_template)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from app.routes import auth, products, categories, orders, health
    app.register_blueprint(health.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(products.bp)
    app.register_blueprint(categories.bp)
    app.register_blueprint(orders.bp)

    return app
