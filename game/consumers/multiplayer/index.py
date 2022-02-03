from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

from match_system.src.match_server.match_service import Match
from game.models.player.player import Player
from channels.db import database_sync_to_async # 串行函数to并行函数

win_score = 50
lose_score = -20


class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
       await self.accept()

    async def disconnect(self, close_code):
        if self.room_name:
            await self.channel_layer.group_discard(self.room_name, self.channel_name);

    async def create_player(self, data):
        self.room_name = None

        self.uuid = data['uuid']
        transport = TSocket.TSocket('127.0.0.1', 9090)
        transport = TTransport.TBufferedTransport(transport)

        protocol = TBinaryProtocol.TBinaryProtocol(transport)

        client = Match.Client(protocol)

        def db_get_player():
            return Player.objects.get(user__username=data['username'])

        player = await database_sync_to_async(db_get_player)()

        transport.open()

        client.add_player(player.score, data['uuid'], data['username'], data['photo'], self.channel_name)

        transport.close()

    async def message(self, data):
        await self.channel_layer.group_send(
                self.room_name, 
                {
                    'type': "group_send_event",
                    'event': "message",
                    'uuid': data['uuid'],
                    'username': data['username'],
                    'text': data['text'],
                })



    async def move_to(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "move_to",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
            },
        )

    async def shoot_fireball(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "shoot_fireball",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
                'ball_uuid': data['ball_uuid'],
            },
        )

    async def shoot_iceball(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "shoot_iceball",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
                'ball_uuid': data['ball_uuid'],
            },
        )

    async def shoot_bullet(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "shoot_bullet",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
                'ball_uuid': data['ball_uuid'],
            },
        )

    def db_update_player_score(self, username, score):
        player = Player.objects.get(user__username=username)
        player.score += score
        player.save()


    async def attack_fireball(self, data):
        if not self.room_name:
            return
        players = cache.get(self.room_name)
        if not players:
            return

        for player in players:
            if player['uuid'] == data['victim_uuid']:
                player['hp'] -= data['damage'] * 100

        remain_cnt = 0
        for player in players:
            if player['hp'] > 0:
                remain_cnt += 1

        if remain_cnt > 1:
            if self.room_name:
                cache.set(self.room_name, players, 3600)
        else:
            for player in players:
                if player['hp'] <= 0:
                    await database_sync_to_async(self.db_update_player_score)(player['username'], lose_score)
                else:
                    await database_sync_to_async(self.db_update_player_score)(player['username'], win_score)

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "attack_fireball",
                'uuid': data['uuid'],
                'victim_uuid': data['victim_uuid'],
                'x': data['x'],
                'y': data['y'],
                'angle': data['angle'],
                'damage': data['damage'],
                'ball_uuid': data['ball_uuid'],
            },
        )

    async def attack_iceball(self, data):
        if not self.room_name:
            return
        players = cache.get(self.room_name)
        if not players:
            return

        for player in players:
            if player['uuid'] == data['victim_uuid']:
                player['hp'] -= data['damage'] * 100

        remain_cnt = 0
        for player in players:
            if player['hp'] > 0:
                remain_cnt += 1

        if remain_cnt > 1:
            if self.room_name:
                cache.set(self.room_name, players, 3600)
        else:
            for player in players:
                if player['hp'] <= 0:
                    await database_sync_to_async(self.db_update_player_score)(player['username'], lose_score)
                else:
                    await database_sync_to_async(self.db_update_player_score)(player['username'], win_score)

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "attack_iceball",
                'uuid': data['uuid'],
                'victim_uuid': data['victim_uuid'],
                'x': data['x'],
                'y': data['y'],
                'angle': data['angle'],
                'damage': data['damage'],
                'ball_uuid': data['ball_uuid'],
            },
        )

    async def blink(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "blink",
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
            },
        )

    async def attack_bullet(self, data):
        if not self.room_name:
            return
        players = cache.get(self.room_name)
        if not players:
            return

        for player in players:
            if player['uuid'] == data['victim_uuid']:
                player['hp'] -= data['damage'] * 100

        remain_cnt = 0
        for player in players:
            if player['hp'] > 0:
                remain_cnt += 1

        if remain_cnt > 1:
            if self.room_name:
                cache.set(self.room_name, players, 3600)
        else:
            for player in players:
                if player['hp'] <= 0:
                    await database_sync_to_async(self.db_update_player_score)(player['username'], lose_score)
                else:
                    await database_sync_to_async(self.db_update_player_score)(player['username'], win_score)

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_send_event",
                'event': "attack_bullet",
                'uuid': data['uuid'],
                'victim_uuid': data['victim_uuid'],
                'x': data['x'],
                'y': data['y'],
                'angle': data['angle'],
                'damage': data['damage'],
                'ball_uuid': data['ball_uuid'],
            },
        )

    async def speedup(self, data):
        await self.channel_layer.group_send(
                self.room_name, 
                {
                    'type': "group_send_event",
                    'event': "speedup",
                    'uuid': data['uuid'],
                },
        )

    async def speednotup(self, data):
        await self.channel_layer.group_send(
                self.room_name, 
                {
                    'type': "group_send_event",
                    'event': "speednotup",
                    'uuid': data['uuid'],
                },
        )

    async def cure(self, data):
        if not self.room_name:
            return
        players = cache.get(self.room_name)
        if not players:
            return

        for player in players:
            if player['uuid'] == data['uuid']:
                player['hp'] += data['val']

        await self.channel_layer.group_send(
                self.room_name, 
                {
                    'type': "group_send_event",
                    'event': "cure",
                    'uuid': data['uuid'],
                    'val': data['val'],
                },
        )


    async def group_send_event(self, data):
        if not self.room_name:
            keys = cache.keys('*%s*' % (self.uuid))
            if keys:
                self.room_name = keys[0]
        await self.send(text_data=json.dumps(data))


    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        if event == "create_player":
            await self.create_player(data)
        elif event == "move_to":
            await self.move_to(data)
        elif event == "shoot_fireball":
            await self.shoot_fireball(data)
        elif event == "attack_fireball":
            await self.attack_fireball(data)
        elif event == "blink":
            await self.blink(data)
        elif event == "shoot_bullet":
            await self.shoot_bullet(data)
        elif event == "attack_bullet":
            await self.attack_bullet(data)
        elif event == "shoot_iceball":
            await self.shoot_iceball(data)
        elif event == "attack_iceball":
            await self.attack_iceball(data)
        elif event == "speedup":
            await self.speedup(data)
        elif event == "speednotup":
            await self.speednotup(data)
        elif event == "cure":
            await self.cure(data)
        elif event == "message":
            await self.message(data)
