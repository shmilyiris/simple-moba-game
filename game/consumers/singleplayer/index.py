from channels.generic.websocket import AsyncWebsocketConsumer
import json
from game.models.player.player import Player
from channels.db import database_sync_to_async # 串行函数to并行函数


class SinglePlayer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    def db_update_player_score(self, username, score):
        player = Player.objects.get(user__username=username)
        player.score += score
        player.save()

    def db_update_player_time(self, username, survival_time):
        player = Player.objects.get(user__username=username)
        player.survive_time = max(survival_time, player.survive_time)
        player.save() 

    async def modify_score(self, username, score):
        await database_sync_to_async(self.db_update_player_score)(username, score)

    async def modify_time(self, username, survival_time):
       await database_sync_to_async(self.db_update_player_time)(username, survival_time)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        if event == "modify_score":
            await self.modify_score(data['username'], data['score'])
        elif event == "modify_time":
            await self.modify_time(data['username'], data['time'])
