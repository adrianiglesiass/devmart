from app.extensions import db
from slugify import slugify
from sqlalchemy import event


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)

    products = db.relationship('Product', backref='category', lazy=True)

    def to_dict(self) -> dict:
        from app.models.product import Product
        product_count = db.session.query(
            Product).filter_by(category_id=self.id).count()

        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'product_count': product_count
        }

    def __repr__(self) -> str:
        return f"<Category {self.id}: {self.name}>"


@event.listens_for(Category.name, 'set')
def generate_slug_simple(target, value, oldvalue, initiator):
    """
    Genera automáticamente el slug basado en el nombre.
    No se necesita gestión de colisiones porque el 'name' es único.
    """
    if value:
        target.slug = slugify(value)
