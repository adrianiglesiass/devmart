from flask import Flask
from .extensions import db, migrate, jwt, cors
from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    from app.models import user, product, category, order, order_item

    from app.routes import auth, products
    app.register_blueprint(auth.bp)
    app.register_blueprint(products.bp)

    return app
