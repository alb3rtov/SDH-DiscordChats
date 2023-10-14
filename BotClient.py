import discord
import decky_plugin

class BotClient(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.members = True
        intents.presences = True
        super().__init__(intents=intents)
        self.dms = {}
        self.chat_channel = {}

    async def on_ready(self):
        decky_plugin.logger.info(f'Logged in as {self.user.name}')

    def get_user_name(self):
        return self.user.name

    def get_server_name(self):
        server_name = "Not in a guild!"
        for guild in self.guilds:
            server_name = guild.name
            break
        return server_name

    async def send_message_to_user(self, user_id, msg):
        user = self.get_user(user_id)
        if user:
            await user.send(msg)
        else:
            decky_plugin.logger.info("Usuario not found")

    async def send_message_to_channel(self, channel_name, msg):
        for guild in self.guilds:
            channel = discord.utils.get(guild.text_channels, name=channel_name)
                
            if channel:
                await channel.send(msg)
            else:
                decky_plugin.logger.info("Channel not found in the guild.")
            break
    
    async def close_session(self):
        await self.close()    
        
    async def get_dms_specific_user(self, username):
        counter = 100
        user = discord.utils.get(self.get_all_members(), name=username)
        if user is not None:
            private_channel = await user.create_dm()

            async for message in private_channel.history(limit=100):
                self.dms[counter] = str(message.author.name) + ";" + str(message.content)
                counter -= 1
        else:
            decky_plugin.logger.info("Usuario not found")

    async def get_messages_from_channel(self, channel_name):
        counter = 100
        for guild in self.guilds:
            for channel in guild.channels:
                if str(channel.name) == channel_name:
                    async for message in channel.history(limit=100):
                        self.chat_channel[counter] = str(message.author.name) + ";" + str(message.content)
                        counter -= 1
            break

    def get_channels(self):
        channels = {}
        for guild in self.guilds:
             for channel in guild.channels:
                if str(channel.type) == "text":
                    channels[channel.id] = channel.name
        return channels
    
    def get_online_members(self):
        online_members = {}
        for guild in self.guilds:
            for member in guild.members:
                if str(self.user.name) != member.name and str(member.status) != "offline":
                    status = str(member.status)
                    if status == "dnd":
                        status = "Do Not Disturb"
                    elif status == "idle":
                        status = "Idle"
                    elif status == "online":
                        status = "Online"

                    online_members[member.id] = str(member.name) + ";" + status
        return online_members 

    def get_offline_members(self):
        offline_members = {}
        for guild in self.guilds:
            for member in guild.members:
                if str(self.user.name) != member.name and str(member.status) == "offline":
                    offline_members[member.id] = str(member.name)
        return offline_members