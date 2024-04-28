from aiogram import Bot
from aiogram.enums import ParseMode

from configuration import ua_config, BOT_TOKEN

async def send_in_progress_message(telegram_id: int, volunteer: str):
    bot = Bot(BOT_TOKEN)
    await bot.send_message(chat_id=telegram_id,
                           text=ua_config.get('request_help', 'request_take_in_progress').format(full_name=volunteer),
                           parse_mode=ParseMode.HTML)


async def send_completed_message(telegram_id: int):
    bot = Bot(BOT_TOKEN)
    await bot.send_message(chat_id=telegram_id,
                           text=ua_config.get('request_help', 'request_completed'),
                           parse_mode=ParseMode.HTML)
