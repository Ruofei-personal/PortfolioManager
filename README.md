# Portfolio Manager

一个用于记录和展示用户持仓的轻量级项目，包含登录注册、持仓增删改查、以及图表化可视展示。

## 功能概览
- 用户注册/登录（基于 Flask-Login 会话）
- 使用 SQLite 存储数据（可随时切换为 MySQL）
- 持仓增删改查
- 饼图 + 柱状图展示持仓占比与绝对值

## 本地运行
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

访问 `http://localhost:5000`。

## 切换为 MySQL
1. 安装依赖，例如 `mysqlclient` 或 `PyMySQL`。
2. 将 `app/__init__.py` 中的 `SQLALCHEMY_DATABASE_URI` 修改为：
   ```
   mysql+pymysql://用户名:密码@主机:3306/数据库名
   ```
3. 重新启动应用即可。
