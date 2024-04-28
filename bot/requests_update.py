import logging

from redis import Redis

from background_tasks import move_in_progress_task, completed_task

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def listen_redis_pubsub():
    r = Redis(host='redis', port=6379)
    pubsub = r.pubsub()
    pubsub.subscribe('requests_update')

    logger.info('Starting to listen on Redis channel...')
    for message in pubsub.listen():
        try:
            if message['type'] == 'message':
                logger.info(f"Received: {message['data']}")
                data = message['data'].decode('utf-8').split(';')
                if data[1] == 'in_progress':
                    move_in_progress_task.delay(data[0], data[2])
                if data[1] == 'completed':
                    completed_task.delay(data[0])
        except Exception as e:
            logger.error(f'Error: {e}. Skiping....')

if __name__ == '__main__':
    listen_redis_pubsub()
