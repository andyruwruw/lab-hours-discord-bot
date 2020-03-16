// Dependencies
let dotenv = require('dotenv');

// Importing class
let TaBot = require('./scripts/bot.js');

// Secret Token Kept in .env
// Retrieving using dotenv
dotenv.config();
let discordToken = process.env.discordToken;

let server = new TaBot({
    token: discordToken,
});

server.login(discordToken);