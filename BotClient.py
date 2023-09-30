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
        decky_plugin.logger.info("hello from botclient.py")
        decky_plugin.logger.info(f'Logeado como: {self.user.name}')
        user = self.get_user(user_id)
        if user:
            await user.send("desdes el plugin te mando este mensaje")
        else:
            decky_plugin.logger.info("Usuario no encontrado")
    
    def get_channels_guild(self, guild):
        for channel in guild.channels:
            print(f' - {channel.name} (Type: {channel.type}, ID: {channel.id})')

    def stop_bot(self):
        try:
            self.loop.stop()
        except RuntimeError as re:
            pass