import aiohttp

from configuration import BACKEND_URL, SECRET_KEY, ua_config

from bot.utils.constants import RequestType


async def get_request_types() -> list[str]:
    resp = []
    for type in RequestType:
        resp.append(type.value)
    return resp


async def create_request(
    type: str,
    text: str,
    full_name: str,
    phone_number: str,
    telegram_id: int
) -> dict:
    url = f'{BACKEND_URL}requests/create/'
    payload = {
        'type': type,
        'description': text,
        'full_name': full_name,
        'phone_number': phone_number,
        'telegram_id': telegram_id,
        'secret_key': SECRET_KEY
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as response:
            status = response.status
            data = {}
            if status == 201:
                data = await response.json()
            return data
