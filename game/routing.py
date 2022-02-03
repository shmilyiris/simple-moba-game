from django.urls import path
from game.consumers.multiplayer.index import MultiPlayer
from game.consumers.singleplayer.index import SinglePlayer

websocket_urlpatterns = [
    path("wss/singleplayer/", SinglePlayer.as_asgi(), name="wss_singleplayer"),
    path("wss/multiplayer/", MultiPlayer.as_asgi(), name="wss_multiplayer"),
]
