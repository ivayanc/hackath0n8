import configparser
import os

from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv('DB_URL')

BOT_TOKEN = os.getenv('TOKEN')
USE_REDIS = os.getenv('USE_REDIS')

BACKEND_URL = os.getenv('BACKEND_URL')
SECRET_KEY = os.getenv('SECRET_KEY')

ua_config = configparser.ConfigParser()
ua_config.read('bot/locales/ua/strings.ini')
