from aiogram.fsm.state import State, StatesGroup


class RegisterForm(StatesGroup):
    full_name = State()
    share_phone_number = State()
