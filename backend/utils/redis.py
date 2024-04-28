import aioredis


async def publish_request_update(request_id: int, request_status: str, extra_field: str = ''):
    redis = aioredis.from_url('redis://redis:6379')
    data = f'{request_id};{request_status};{extra_field}'

    await redis.publish("requests_update", data)
