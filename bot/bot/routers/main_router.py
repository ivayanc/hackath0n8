from datetime import datetime

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, ReplyKeyboardRemove
from aiogram.types.contact import Contact
from aiogram.fsm.context import FSMContext
from aiogram.filters import CommandStart, Command, CommandObject
from aiogram.utils.deep_linking import decode_payload
from aiogram.fsm.context import FSMContext

from bot.utils.keyboards import MainKeyboards
from bot.states.register_form import RegisterForm
from database.base import session
from database.models.user import User
from bot.routers.request_router import request_router

from configuration import ua_config

main_router = Router()
main_router.include_router(request_router)


async def send_welcome_message(message: Message, edit_message: bool = False) -> None:
    welcome_text = ua_config.get('prompts', 'start_message')
    if edit_message:
        await message.bot.delete_message(chat_id=message.chat.id,
                                         message_id=message.message_id)
    await message.answer(welcome_text)


@main_router.message(CommandStart())
async def command_start_handler(message: Message, state: FSMContext) -> None:
    await state.clear()
    await send_welcome_message(message)
    await state.set_state(RegisterForm.full_name)
    await message.bot.send_message(text=ua_config.get('prompts', 'enter_fullname'),
                                   chat_id=message.chat.id,
                                   reply_markup=ReplyKeyboardRemove())


@main_router.message(RegisterForm.full_name)
async def process_manage_profile_reply(message: Message, state: FSMContext):
    await state.update_data(full_name=message.text)
    await message.reply(text=ua_config.get('prompts', 'share_phone_number'), reply_markup=MainKeyboards.share_contact_keyboard())
    await state.set_state(RegisterForm.share_phone_number)


@main_router.message(RegisterForm.share_phone_number)
async def process_manage_profile_reply(message: Message, state: FSMContext):
    if not message.contact:
        await message.bot.send_message(text='Please use keyboard')
    else:
        data = await state.get_data()
        phone_number = message.contact.phone_number
        full_name = data.get('full_name')
        await state.clear()
        telegram_id = message.from_user.id
        with session() as s:
            user = s.query(User).filter(User.telegram_id == telegram_id).first()
            user.full_name = full_name
            user.phone_number = phone_number
            s.add(user)
            s.commit()
        await message.bot.send_message(chat_id=message.chat.id,
                                       text=ua_config.get('prompts', 'registration_completed'),
                                       reply_markup=MainKeyboards.default_keyboard())


@main_router.message(F.text == ua_config.get('buttons', 'help'))
async def evacuation_handler(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.bot.send_message(
        chat_id=message.chat.id,
        text=ua_config.get('prompts', 'help_message'),
        reply_markup=MainKeyboards.default_keyboard()
    )
