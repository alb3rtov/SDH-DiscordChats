# SDH-DiscordChats
DiscordChats is a plugin for the Steam Deck, to use the discord chats of a specific server. You will be able to write in all channels and to all members of the server, and also shows the status of each member. This is possible because it uses the [discord api](https://discordpy.readthedocs.io/en/stable/api.html) to create a bot which will be the user that will be used to perform all actions.

## Installation
At the moment, you can only install this plugin manually. You have to options:

1. Download the latest release package (ZIP file): https://github.com/alb3rtov/SDH-DiscordChats/releases
2. Copy the ZIP file to Steam Deck and install it from Decky loader. More info here: https://wiki.deckbrew.xyz/en/user-guide/settings

Alternatively, you can build the plugin SDH-DiscordChats from source code by following these steps:

1. Clone the SDH-DiscordChats repository:
    ```
    git clone https://github.com/alb3rtov/SDH-DiscordChats
    ```
2. Navigate to the project directory:
    ```
    cd SDH-DiscordChats
    ```
3. Install frontend dependencies:
    ```
    pnpm i
    ```
4. Install and deploy backend python dependencies:
    ```
    make setup
    ```
5. Generate a build from VSCode running the `setup` and `build` tasks. This will generate a ZIP file in a directory called `out`
6. Copy the ZIP file to Steam Deck and install it from Decky loader. More info here: https://wiki.deckbrew.xyz/en/user-guide/settings

## Discord server configuration 
In the privacy settings of the server it is necessary to have the following options activated for the correct functioning of the plugin:

- Direct messages: **On**
- Message requests: **On**
- Status of the activity: **On**

## Setup discord application bot
First you have to create an `new application` in the [discord developers portal](https://discord.com/developers/applications) and gave it a name, for example `steamdeckchatbot`. Once you have created the application, you have to configure the next parameters:

- Go to `Bot` tab, and in the **Privileged Gateway Intents** section:
    - Presence intent: **On**
    - Server members intent: **On**
    - Message content intent: **On**

- Then, go to `OAuth2` tab, in **Redirect** section set some URL like www.google.es or something like that (this is not important but it is necessary to set one).

- In `OAuth2` tab, go to `URL Generator`:
    - In `Scopes` section, select everything (probably it is not necessary all the scopes but to avoid problems I prefer to select everything)
    - It is necessary to select `Bot` in `Scopes` section, in order to display the `Bot permissions` section. In `Bot permissions` section select Administrator. (Once again, probably it is not necessary all the permissions)

- Get the URL generated at the bottom and paste it in the web browser. Then, select the guild/server you want to put the bot on.

**DISCLAIMER: At the moment, this plugin only supports one server per bot. So if the bot are in several servers, the plugin will not work properly**

If you want to add the bot to a discord server of which you are not the owner, you must have administrator permissions to do so, or have the owner add the bot for you.

## Token configuration
The token associated with the previously created bot is required for the plugin to work. You can obtain this token by accessing [discord.com/developers/applications](https://discord.com/developers/applications), select the `steamdeckchatbot` application (or the name you choose to this app), go to the `Bot` tab in the `Settings` menu. An option called `Reset Token` will appear which will reset the token and display it on the screen. Copy the token and save it to the following path on the steam deck file system
`/home/deck/homebrew/services/token.txt`

## Acknowledgements
This project has been developed thanks to the [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) platform created by the [SteamDeckHomebrew](https://github.com/SteamDeckHomebrew) team in addition to the [template](https://github.com/SteamDeckHomebrew/decky-plugin-template) for the development of new plugins.

## License
This project is licensed under the BSD 3-Clause License - see the [LICENSE](https://github.com/alb3rtov/SDH-DiscordChats/blob/master/LICENSE) file for details.

This project uses [discord.py](https://github.com/Rapptz/discord.py) API licensed under the MIT License - see the [LICENSE](https://github.com/Rapptz/discord.py/blob/master/LICENSE) file for details.