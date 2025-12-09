# 第一步：安装依赖（终端执行）
# pip install flask flask-sqlalchemy pymysql werkzeug flask-cors

# 导入需要的库
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # 解决前端跨域
from werkzeug.security import generate_password_hash, check_password_hash  # 密码加密
from datetime import datetime
import config  # 导入配置文件

# 初始化Flask应用
app = Flask(__name__)

# 第二步：配置MySQL连接（改这里！填你自己的MySQL密码）
app.config.from_object(config)  # 加载config.py里的所有配置

# 初始化数据库
db = SQLAlchemy(app)
# 允许跨域（前端调接口不报错）
CORS(app)


# -------------------------- 数据库模型（对应MySQL表） --------------------------
# 用户表（适配你的注册界面）
class User(db.Model):
    __tablename__ = 'user'  # 明确指定MySQL表名
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)  # 主键自增
    student_id = db.Column(db.String(20), unique=True, nullable=False, name='student_id')  # 学号（唯一、必填）
    username = db.Column(db.String(50), nullable=False)  # 用户名（必填）
    school = db.Column(db.String(100), nullable=False)  # 学校（必填）
    email = db.Column(db.String(100), unique=True, nullable=False)  # 邮箱（唯一、必填）
    phone = db.Column(db.String(11), unique=True)  # 手机号（可选、唯一）
    password_hash = db.Column(db.String(255), nullable=False)  # 加密密码（必填）
    create_time = db.Column(db.DateTime, default=datetime.now)  # 创建时间

    # 密码加密（存数据库不用明文）
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # 验证密码（登录时用）
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# 商品表（练手够用版）
class Goods(db.Model):
    __tablename__ = 'goods'  # MySQL表名
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)  # 商品标题
    price = db.Column(db.Float, nullable=False)  # 价格
    description = db.Column(db.Text)  # 商品描述
    image_url = db.Column(db.String(255))  # 商品图片链接（练手可存本地/在线链接）
    seller_id = db.Column(db.BigInteger, db.ForeignKey('user.id'))  # 关联发布者（外键）
    create_time = db.Column(db.DateTime, default=datetime.now)


# -------------------------- 核心接口（前端能直接调） --------------------------
# 1. 注册接口（对应前端注册页）
@app.route('/api/register', methods=['POST'])
def register():
    # 获取前端传的JSON数据
    data = request.get_json()
    # 简单校验：必填字段不能少
    required_fields = ['student_id', 'username', 'school', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'code': 1, 'msg': f'「{field}」不能为空哦！'})

    # 校验学号/邮箱是否已注册
    if User.query.filter_by(student_id=data['student_id']).first():
        return jsonify({'code': 1, 'msg': '这个学号已经注册过啦～'})
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'code': 1, 'msg': '这个邮箱已经注册过啦～'})

    # 创建新用户（密码加密）
    new_user = User(
        student_id=data['student_id'],
        username=data['username'],
        school=data['school'],
        email=data['email'],
        phone=data.get('phone'),  # 手机号可选
    )
    new_user.set_password(data['password'])  # 密码加密存储

    # 保存到MySQL
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({'code': 0, 'msg': '注册成功！快去登录～'})
    except Exception as e:
        db.session.rollback()  # 出错回滚
        return jsonify({'code': 1, 'msg': f'注册失败：{str(e)}'})


# 2. 登录接口（对应前端登录页）
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    # 校验学号和密码
    if not data.get('student_id') or not data.get('password'):
        return jsonify({'code': 1, 'msg': '学号和密码都要填哦！'})

    # 查用户
    user = User.query.filter_by(student_id=data['student_id']).first()
    # 校验密码
    if not user or not user.check_password(data['password']):
        return jsonify({'code': 1, 'msg': '学号或密码错啦～'})

    # 登录成功，返回用户信息（练手不用token，简单返回）
    return jsonify({
        'code': 0,
        'msg': '登录成功！',
        'data': {
            'username': user.username,
            'school': user.school,
            'student_id': user.student_id
        }
    })


# 3. 发布商品接口（核心功能）
@app.route('/api/add_goods', methods=['POST'])
def add_goods():
    data = request.get_json()
    # 1. 校验必填参数
    required_fields = ['title', 'price', 'description', 'seller_id']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'code': 1, 'msg': f'「{field}」不能为空！'})
    # 2. 校验卖家是否存在
    seller = User.query.filter_by(student_id=data['seller_id']).first()
    if not seller:
        return jsonify({'code': 1, 'msg': '卖家不存在！'})
    # 3. 创建商品
    new_goods = Goods(
        title=data['title'],
        price=float(data['price']),
        description=data['description'],
        seller_id=seller.id,  # 关联用户ID
        create_time=datetime.now()
    )
    db.session.add(new_goods)
    try:
        db.session.commit()
        return jsonify({'code': 0, 'msg': '商品发布成功！'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'code': 1, 'msg': f'发布失败：{str(e)}'})

# 4. 获取商品列表（前端展示二手商品）
@app.route('/api/goods_list', methods=['GET'])
def goods_list():
    # 查询所有商品
    goods_list = Goods.query.all()
    # 格式化返回数据
    result = []
    for goods in goods_list:
        result.append({
            'id': goods.id,
            'title': goods.title,
            'price': goods.price,
            'description': goods.description,
            'image_url': goods.image_url,
            'seller_id': goods.seller_id,
            'create_time': goods.create_time.strftime('%Y-%m-%d %H:%M')
        })
    return jsonify({'code': 0, 'data': result})


# -------------------------- 启动应用 --------------------------
if __name__ == '__main__':
    # 启动前创建所有表（第一次运行会自动在MySQL建user和goods表）
    with app.app_context():
        db.create_all()  # 自动建表（如果表不存在）
    # 启动服务（端口5000，前端可访问http://localhost:5000）
    app.run(debug=True, host='0.0.0.0', port=5000)