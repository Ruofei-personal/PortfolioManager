import json

from flask import Blueprint, redirect, render_template, request, url_for
from flask_login import current_user, login_required

from app.extensions import db
from app.models import Holding

portfolio_bp = Blueprint("portfolio", __name__)


@portfolio_bp.route("/")
def index():
    return redirect(url_for("auth.login"))


@portfolio_bp.route("/dashboard")
@login_required
def dashboard():
    holdings = Holding.query.filter_by(user_id=current_user.id).all()
    total_value = sum(holding.total_cost for holding in holdings)

    chart_data = [
        {
            "label": holding.name,
            "value": holding.total_cost,
        }
        for holding in holdings
    ]

    return render_template(
        "dashboard.html",
        holdings=holdings,
        total_value=total_value,
        chart_data=json.dumps(chart_data, ensure_ascii=False),
    )


@portfolio_bp.route("/holdings", methods=["POST"])
@login_required
def add_holding():
    holding = Holding(
        user_id=current_user.id,
        symbol=request.form.get("symbol", "").strip(),
        name=request.form.get("name", "").strip(),
        quantity=float(request.form.get("quantity", 0)),
        cost_price=float(request.form.get("cost_price", 0)),
    )
    db.session.add(holding)
    db.session.commit()
    return redirect(url_for("portfolio.dashboard"))


@portfolio_bp.route("/holdings/<int:holding_id>", methods=["POST"])
@login_required
def update_holding(holding_id: int):
    holding = Holding.query.filter_by(id=holding_id, user_id=current_user.id).first_or_404()
    holding.symbol = request.form.get("symbol", "").strip()
    holding.name = request.form.get("name", "").strip()
    holding.quantity = float(request.form.get("quantity", 0))
    holding.cost_price = float(request.form.get("cost_price", 0))
    db.session.commit()
    return redirect(url_for("portfolio.dashboard"))


@portfolio_bp.route("/holdings/<int:holding_id>/delete", methods=["POST"])
@login_required
def delete_holding(holding_id: int):
    holding = Holding.query.filter_by(id=holding_id, user_id=current_user.id).first_or_404()
    db.session.delete(holding)
    db.session.commit()
    return redirect(url_for("portfolio.dashboard"))
