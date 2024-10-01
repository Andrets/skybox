from aiogram.fsm.state import State, StatesGroup

class Admin(StatesGroup):
    mailing_state = State()
    mailing_text = State()
    mailing_text_only = State()
    ask = State()
    confirm_yes = State()
    confirm_no = State()