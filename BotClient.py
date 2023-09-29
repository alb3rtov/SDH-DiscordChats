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

    async def get_server_name(self):
        if self.guilds:
            server_name = self.guilds[0]
            decky_plugin.logger.info(server_name)
            return server_name
        else:
            return "Not in any guilds."
    
    def get_channels_guild(self, guild):
        for channel in guild.channels:
            print(f' - {channel.name} (Type: {channel.type}, ID: {channel.id})')

    def stop_bot(self):
        try:
            self.loop.stop()
        except RuntimeError as re:
            pass