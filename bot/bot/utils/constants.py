from enum import Enum

from configuration import ua_config

class RequestType(Enum):
    psychological = ua_config.get('request_type', 'psychological')
    legal = ua_config.get('request_type', 'legal')
    nutrition = ua_config.get('request_type', 'nutrition')
    military = ua_config.get('request_type', 'military')
    medical = ua_config.get('request_type', 'medical')
    clothing = ua_config.get('request_type', 'clothing')
    baby = ua_config.get('request_type', 'baby')
    household = ua_config.get('request_type', 'household')
    equipments = ua_config.get('request_type', 'equipments')


FORMATE_REQUEST_STATUS = {
    'new': ua_config.get('request_help_progress_status', 'new'),
    'in_progress': ua_config.get('request_help_progress_status', 'in_progress')
}