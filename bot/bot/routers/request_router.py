from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.enums.parse_mode import ParseMode
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from sqlalchemy import select, and_
from datetime import datetime

from database.base import session

from bot.utils.keyboards import RequestKeyboards
from bot.utils.utils import get_request_types, create_request
from bot.states.request_form import RequestForm
from configuration import ua_config
from database.models.user import User

request_router = Router()


@request_router.message(F.text == ua_config.get('buttons', 'request_help'))
async def request_help_handler(message: Message, state: FSMContext) -> None:
    telegram_id = message.from_user.id
    with session() as s:
        user = s.query(User).filter(User.telegram_id == telegram_id).first()
    types = await get_request_types()
    await state.clear()
    if not user.request_sent:
        await message.bot.send_message(
            chat_id=message.chat.id,
            text=ua_config.get('request_help', 'request_type'),
            reply_markup=RequestKeyboards.select_type(types)
        )
        await state.update_data(user_id=telegram_id)
        await state.set_state(RequestForm.request_type)
    else:
        await message.bot.send_message(
            chat_id=message.chat.id,
            text=ua_config.get('request_help', 'request_already_sent')
        )


@request_router.callback_query(RequestForm.request_type)
async def request_type_handler(callback: CallbackQuery, state: FSMContext) -> None:
    await state.update_data(type=callback.data)
    await state.set_state(RequestForm.request_text)
    await callback.message.bot.edit_message_text(
        chat_id=callback.message.chat.id,
        message_id=callback.message.message_id,
        text=ua_config.get('request_help', 'request_text'),
        reply_markup=None
    )


@request_router.message(RequestForm.request_text)
async def request_text_handler(message: Message, state: FSMContext) -> None:
    data = await state.get_data()
    telegram_id = data.get('user_id')
    type = data.get('type')
    text = message.text
    with session() as s:
        user = s.query(User).filter(User.telegram_id == telegram_id).first()
    response = await create_request(
        type=type,
        text=text,
        full_name=user.full_name,
        phone_number=user.phone_number,
        telegram_id=user.telegram_id
    )
    request_id = response.get('id')
    if request_id:
        with session() as s:
            user.request_sent = True
            user.request_id = request_id
            s.add(user)
            s.commit()
        await message.bot.send_message(
            chat_id=message.chat.id,
            text=ua_config.get('request_help', 'request_accepted').format(
                type=type,
                text=text,
                full_name=user.full_name,
                phone_number=user.phone_number
            )
        )
    else:
        await message.bot.send_message(
            chat_id=message.chat.id,
            text=ua_config.get('request_help', 'request_error')
        )
