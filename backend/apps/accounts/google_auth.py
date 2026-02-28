import logging
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


def verify_google_id_token(token, expected_client_id):
    try:
        payload = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            expected_client_id,
            clock_skew_in_seconds=10,
        )
        return payload
    except Exception as e:
        return None