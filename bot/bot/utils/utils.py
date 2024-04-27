from configuration import ua_config

from bot.utils.constants import RequestType


async def get_request_types() -> list[str]:
    resp = []
    for type in RequestType:
        resp.append(type.value)
    return resp
