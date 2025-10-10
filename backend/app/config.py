import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///shop.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_secret')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_secret')
