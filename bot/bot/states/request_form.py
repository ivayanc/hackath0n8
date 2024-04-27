from aiogram.fsm.state import State, StatesGroup


class RequestForm(StatesGroup):
    request_type = State()
    request_text = State()
