from datetime import timedelta

from typing_extensions import Optional
from fastapi_jwt import JwtAuthorizationCredentials, JwtAccessBearer
from config import CONFIG

ACCESS_EXPIRES = timedelta(minutes=15)
REFRESH_EXPIRES = timedelta(days=30)

access_security = JwtAccessBearer(
    CONFIG.authjwt_secret_key,
    access_expires_delta=ACCESS_EXPIRES,
    refresh_expires_delta=REFRESH_EXPIRES,
)


async def user_from_credentials(auth: JwtAuthorizationCredentials) -> Optional[str] :
    """Return the user associated with auth credentials."""
    return await auth.subject["username"]



