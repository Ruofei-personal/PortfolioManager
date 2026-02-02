from flask import Flask

from app.auth import auth_bp
from app.extensions import db, login_manager
from app.portfolio import portfolio_bp


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "dev-secret-change-me"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///portfolio.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    login_manager.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(portfolio_bp)

    with app.app_context():
        db.create_all()

    return app
