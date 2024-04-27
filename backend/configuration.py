import os

from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv('DB_URL')

SECRET_KEY = os.getenv('SECRET_KEY')

JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
JWT_REFRESH_SECRET_KEY = os.getenv('JWT_REFRESH_SECRET_KEY')