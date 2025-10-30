#!/usr/bin/env python
"""Script to run database migrations"""
import os
from run import app
from flask_migrate import upgrade

if __name__ == '__main__':
    with app.app_context():
        print("Running database migrations...")
        upgrade()
        print("Migrations completed successfully!")
