from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, KeyboardButton, ReplyKeyboardMarkup

from configuration import ua_config


class MainKeyboards:

    @staticmethod
    def default_keyboard():
        return MainKeyboards.guest_keyboard()

    @staticmethod
    def guest_keyboard():
        result_kb = ReplyKeyboardMarkup(
            keyboard=[
                [
                    KeyboardButton(text=ua_config.get('buttons', 'request_help')),
                ],
                [
                    KeyboardButton(text=ua_config.get('buttons', 'help'))
                ]
            ],
            resize_keyboard=True
        )
        return result_kb

    @staticmethod
    def share_contact_keyboard():
        share_button = KeyboardButton(text=ua_config.get('buttons', 'share_contact'), request_contact=True)
        share_keyboard = ReplyKeyboardMarkup(
            keyboard=[
                [
                    share_button
                ]
            ],
            resize_keyboard=True,
            one_time_keyboard=True
        )
        return share_keyboard


class RequestKeyboards:

    @staticmethod
    def select_type(types: list[str]):
        keyboard = InlineKeyboardMarkup(inline_keyboard=[])
        for type in types:
            keyboard.inline_keyboard.append([
                InlineKeyboardButton(text=type, callback_data=type)
            ])
        return keyboard
