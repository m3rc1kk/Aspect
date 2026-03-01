import logging
import os

from django.conf import settings
from google.cloud import vision

logger = logging.getLogger(__name__)

MIN_IMAGE_BYTES = 100


def get_vision_client():
    return vision.ImageAnnotatorClient()


def check_image_moderation(image_path: str):
    creds_path = getattr(settings, 'GOOGLE_APPLICATION_CREDENTIALS', None)
    if creds_path and os.path.isfile(creds_path):
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(creds_path)
    else:
        logger.warning("GOOGLE_APPLICATION_CREDENTIALS not set or file missing; approving image without check")
        return True, {}

    with open(image_path, 'rb') as f:
        content = f.read()
    if len(content) < MIN_IMAGE_BYTES:
        logger.warning("Image too small (%s bytes); approving without API call", len(content))
        return True, {}

    client = get_vision_client()
    image = vision.Image(content=content)
    response = client.safe_search_detection(image=image)

    if getattr(response, 'error', None) and response.error.message:
        logger.warning("Vision API error (approving image): %s", response.error.message)
        return True, {}

    safe = getattr(response, 'safe_search_annotation', None)
    if safe is None:
        logger.warning("Vision API returned no safe_search_annotation; approving")
        return True, {}

    block_levels = (vision.Likelihood.LIKELY, vision.Likelihood.VERY_LIKELY)
    adult = getattr(safe, 'adult', None)
    racy = getattr(safe, 'racy', None)
    violence = getattr(safe, 'violence', None)

    if adult is not None and adult in block_levels:
        return False, {'reason': 'adult'}
    if racy is not None and racy in block_levels:
        return False, {'reason': 'racy'}
    if violence is not None and violence in block_levels:
        return False, {'reason': 'violence'}

    return True, {}
