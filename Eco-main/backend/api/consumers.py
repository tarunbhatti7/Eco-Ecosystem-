from django.template.loader import render_to_string
from channels.generic.websocket import WebsocketConsumer,AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from django.core.files.base import ContentFile
from channels.db import database_sync_to_async
import json
from asgiref.sync import async_to_sync
from django.core.cache import cache
import base64
import json
import os
from rest_framework.response import Response

from urllib.parse import parse_qs

class EcoSystemConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user'] if 'user' in self.scope else None
        self.connection = self.scope['url_route']['kwargs']['connection'] if 'connection' in self.scope['url_route']['kwargs'] else None

        self.guest_user = None

        if self.user == None:
            query_string = self.scope['query_string'].decode()
            query_params = parse_qs(query_string)
            guest = query_params.get('guest', [None])[0]    
            self.guest_user = guest if guest else None

        # if self.user is None or self.connection is None:
        #     pass

        if self.user or self.guest_user:
            try:
                if self.user != None:
                    print(f"connection for user {self.user}")
                else :
                    print(f"connection for guest_user {self.guest_user}")

                async_to_sync(self.channel_layer.group_add)(
                    self.connection, self.channel_name
                )

                if self.user != None:
                    self.update_user_list(self.connection, self.user.username)
                else:
                    self.update_user_list(self.connection, self.guest_user)

                self.accept()

                lisst = self.get_user_list(self.connection)
                    
                if len(lisst) > 0:

                    event ={
                        'type': 'handlelist',
                        'typeof': 'p_message_b',
                        'list':f'{self.get_user_list(self.connection)}',
                        'new_user':f'{self.user.username if self.user != None else self.guest_user}'
                    }

                    async_to_sync(self.channel_layer.group_send)(
                        self.connection , event
                    )


            except: 
                return Response({'error':'something wrong'})

    def handlelist(self,event):
        self.send(json.dumps({
            'typeof': 'p_message_b',
            'list':event['list']
        }))

    def disconnect(self,code):
        if self.user or self.guest_user:
            if self.connection:
                if self.user != None:
                    self.update_user_list(self.connection, self.user.username, remove=True)
                else:
                    self.update_user_list(self.connection, self.guest_user, remove=True)
                
                lisst = self.get_user_list(self.connection)

                if len(lisst) > 0:

                    event ={
                        'type': 'handlelist',
                        'typeof': 'p_message_b',
                        'list':f'{lisst}'
                    }

                    async_to_sync(self.channel_layer.group_send)(
                        self.connection , event
                    )
        if self.user:
            print(f"disconnected fo user {self.user}")
        else:
            print(f"disconnected fo guest_user {self.guest_user}")

        async_to_sync(self.channel_layer.group_discard)(
            self.connection,self.channel_name
        )

    def update_user_list(self, connection, username, remove=False):
        # Retrieve the current user list from cache
        key = f"group_users_{connection}"
        users = cache.get(key, set())
    
        if remove:
            users.discard(username)
        else:
            users.add(username)
        
        # Store the updated user list in cache
        cache.set(key, users)

    def get_user_list(self, connection):
        key = f"group_users_{connection}"
        return list(cache.get(key, []))

    def receive(self,text_data=None):
        text_data_dict = json.loads(text_data)
        copy_text = text_data_dict.get('copy')
        file_data = text_data_dict.get('file')
        file_name = text_data_dict.get('file_name')
        f_user = text_data_dict.get('f_user')
        typeof = text_data_dict.get('typeof')
        disa = text_data_dict.get('disa')

        sent = 'inprogress'

        if(copy_text):
            print(copy_text)
        if(file_name):
            print(file_name)
            # print(file_data)

        if typeof != 'copy':
            event = {
                'type':'dall_handler',
                'typeof':typeof,
                'disa':disa, 
            }

            async_to_sync(self.channel_layer.group_send)(
                self.connection , event
            )

        else:
            event = {
                'type':'copy_handler',
                'typeof':'copy',
                'copy_text': copy_text,
                'file_data': file_data,
                'file_name': file_name,
                'f_user' : f_user
            }

            async_to_sync(self.channel_layer.group_send)(
                self.connection , event
            )

            if file_name and file_name :
                sent = 'done'
                if sent == 'done':
                    self.send(json.dumps({
                        'typeof': 'progress',
                        'sent': sent 
                    }))

    def copy_handler(self,event):
        copy_text = event['copy_text']
        type_of = event['typeof']
        f_user = event['f_user']
        file_data = event['file_data']
        file_name = event['file_name']

        self.send(json.dumps({
            'typeof':type_of,
            'copy_text':copy_text,
            'file_data': file_data,
            'file_name': file_name,
            'f_user':f_user
        }))

    def dall_handler(self,event):
        typeof = event['typeof']
        disa = event['disa']

        self.send(json.dumps({
            'typeof':typeof,
            'disa':disa
        }))
