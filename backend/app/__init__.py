from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt, migrate
from app.config import config


def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from app.routes import auth, products, categories, orders
    app.register_blueprint(auth.bp)
    app.register_blueprint(products.bp)
    app.register_blueprint(categories.bp)
    app.register_blueprint(orders.bp)

    return app
