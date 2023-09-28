import os
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

    def get_guild_id(self):
        if self.guilds:
            for guild in self.guilds:
                return guild
        else:
            return "Not in any guilds."
    
    def get_channels_guild(self, guild):
        for channel in guild.channels:
            print(f' - {channel.name} (Type: {channel.type}, ID: {channel.id})')

    def stop_bot(self):
        try:
            self.keep_running = False  # Set the flag to False to stop the bot
            self.loop.stop()  # Stop the event loop
        except RuntimeError as re:
            pass