import os
import sys
import time
# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin

import threading
import certifi

sys.path.append(os.path.dirname(__file__))

from BotClient import BotClient

os.environ["SSL_CERT_FILE"] = certifi.where()

def run_bot(client, token, login):
    try:
        client.run(token)
    except Exception as e:
        login[0] = 0
        decky_plugin.logger.info(f"An error occurred: {e}")

class Plugin:
    async def get_server_name(self):
        self.server_name = self.client.get_server_name()
        decky_plugin.logger.info(self.server_name)
        return self.server_name

    async def get_login(self):
        return self.login[0]

    async def set_login(self, status):
        self.login[0] = status

    async def stop_bot(self):
        self.login[0] = 2
        await self.client.stop_bot()
        
    async def start_bot(self):
        self.client = BotClient()
        bot_thread = threading.Thread(name='StartBotThread', target=run_bot, args=(self.client, self.token, self.login))
        bot_thread.start()

    async def _main(self):
        decky_plugin.logger.info("Hello World!")

        self.client = BotClient()
        self.login = [0]
        self.server_name = ""

        try:
            with open("token.txt", "r") as file:
                self.token = file.read()
        except Exception as e:
            decky_plugin.logger.info(e)

        decky_plugin.logger.info("Fin Hello World!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(os.path.join(decky_plugin.DECKY_USER_HOME,
                                               ".config", "decky-template", "template.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"))
