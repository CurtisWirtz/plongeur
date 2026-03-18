import os

env = os.environ.get("DJANGO_ENV", "dev").lower()

if env == "prod":
    from .prod import *
else:
    from .dev import *