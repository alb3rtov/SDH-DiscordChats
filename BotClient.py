import discord
import decky_plugin

class BotClient(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.members = True
        intents.presences = True
        super().__init__(intents=intents)

    async def on_ready(self):
        decky_plugin.logger.info(f'Logged in as {self.user.name}')

    def get_server_name(self):
        server_name = "Not in a guild!"
        for guild in self.guilds:
            server_name = guild.name
            break
        return server_name

    async def send_message_to_user(self, user_id):
        user = self.get_user(user_id)
        if user:
            await user.send("desdes el plugin te mando este mensaje")
        else:
            decky_plugin.logger.info("Usuario no encontrado")
    
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
    
    def stop_bot(self):
        try:
            self.loop.stop()
        except RuntimeError as re:
            pass