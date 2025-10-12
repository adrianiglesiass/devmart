from app.extensions import db
from datetime import datetime, timezone


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total = db.Column(db.Float, nullable=False)
    estado = db.Column(db.String(50), default='pendiente')
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))

    items = db.relationship('OrderItem', backref='order',
                            lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total': self.total,
            'estado': self.estado,
            'created_at': self.created_at.isoformat(),
            'items': [item.to_dict() for item in self.items]
        }

    def __repr__(self):
        return f"<Order {self.id}: User {self.user_id} - ${self.total}>"
