# mnlth-discord-bot
A discord bot to get informed of live data of MNLTH reveal process

This discord bot use a js script that scrap opensea every 5 minutes to retrieve data regarding MNLTH reveal process.
It comes with commands that give various informations and analytics about the reveal process state live state like:
- Actual revealed distribution
- Collections floor price
- Available supply left
- ...

# Invite MNLTH discord bot: 

You can add the mnlth-discord-bot to your server by using this link:

- https://discord.com/api/oauth2/authorize?client_id=971530632826077265&permissions=0&scope=applications.commands%20bot



# Run it yourself:

You can also host the bot by yourself following these steps:

1: Clone the repo

2: Make sure to use node v16.15.0+

3: Install dependencies: `npm install`

4: run the node-cron at: `node /commands/scripts/retrieveData.json`

5: Create your config.json file:

```json
{
  "token": YOUR_TOKEN,
  "clientId": YOUR_CLIENT_ID
}
```

6: run the discord bot: `node .`

# Screenshots:

![image](https://user-images.githubusercontent.com/105301169/167681233-55096972-b16e-44c2-a65a-76e7977b27a1.png)
![image](https://user-images.githubusercontent.com/105301169/167682627-688c9173-ebc2-4156-bc68-bab0a3732d77.png)

