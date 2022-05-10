# mnlth-discord-bot
A discord bot to get informed of live data of MNLTH reveal process

This discord bot use a js script that scrap opensea every 5 minutes to retrieve data regarding MNLTH reveal process.
It comes with commands that give various informations and analytics about the reveal process state live state like:
- Actual revealed distribution
- Collections floor price
- Available supply left
- ...


HOW TO RUN IT BY YOURSELF:

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



![image](https://user-images.githubusercontent.com/105301169/167681233-55096972-b16e-44c2-a65a-76e7977b27a1.png)
