import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from api import routing as api_routing

# Set the default settings module for Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Project.settings')

# Initialize Django and set up the app registry
django.setup()  # This ensures that the apps are fully loaded before proceeding

# Now it's safe to import middleware and other Django-dependent modules
from api.middleware import JWTAuthMiddleware  # Import after django.setup()

# Get the ASGI application for handling HTTP requests
django_asgi_app = get_asgi_application()

# Define the ProtocolTypeRouter for handling both HTTP and WebSocket requests
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddleware(
            URLRouter(api_routing.websocket_urlpatterns)
        )
    ),
})
