from flask import Flask, request, session, url_for

from app.auth import auth_bp
from app.extensions import db, login_manager
from app.i18n import translate
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

    @app.before_request
    def set_locale():
        if "lang" in request.args:
            lang = request.args.get("lang")
            if lang in {"zh", "en"}:
                session["lang"] = lang
        session.setdefault("lang", "zh")

    @app.context_processor
    def inject_i18n():
        lang = session.get("lang", "zh")
        switch_lang = "en" if lang == "zh" else "zh"
        switch_url = f"?lang={switch_lang}"
        if request.endpoint:
            view_args = request.view_args or {}
            args = request.args.to_dict()
            args["lang"] = switch_lang
            try:
                switch_url = url_for(request.endpoint, **view_args, **args)
            except Exception:
                switch_url = f"?lang={switch_lang}"

        def t(key: str) -> str:
            return translate(lang, key)

        return {
            "t": t,
            "current_lang": lang,
            "switch_lang": switch_lang,
            "switch_url": switch_url,
        }

    with app.app_context():
        db.create_all()

    return app
