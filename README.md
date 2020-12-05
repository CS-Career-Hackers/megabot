# CSCH Megabot

A megabot for everything CSCH needs, composed of smaller mostly standalone packages. This project uses [Discord.js](https://discord.js.org/#/).

## Getting Started

1. Clone repo.

```
git clone https://github.com/cscareerhub/megabot.git
```

2. Use [nvm](https://github.com/nvm-sh/nvm) to switch to Node version 14.

```
nvm install 14
nvm use 14
```

3. Use yarn to install dependencies.

```
yarn install
```

4. Get tester bot token and set a variable in `.env`.

```
BOT_TOKEN=yourtesttoken
```

5. Run bot.

```
yarn start
```

## Contributing

0. Optional: Join us on the CSCH Discord server where we will give you access to the bot dev channel where we discuss and test bots.

1. Fork the repo

2. Create a branch with the following naming scheme

```
feature/<yourfeature>
bugfix/<yourbugfix>
docs/<yourdocchange>
test/<yourtestingchange>
misc/<yourmiscchange>
```

2. Use the Prettier plugin to autoformat your code based on the `eslint` and `prettier` configs if you use VSCode or other editor with support for something similar.

3. Once you've made change, create a pull request to the CSCH megabot repo's master branch which will require at least one review from CSCH staff. If it's been over a week, feel free to ping us once in the Discord.
