# 数据库连接配置
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:wusizhe7226299@localhost:3306/campus_secondhand'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = 'campus_secondhand_2025'  # 随便填，用于会话加密
JSON_AS_ASCII = False  # 解决中文乱码
UPLOAD_FOLDER = 'static/images'  # 图片上传路径（后续用）