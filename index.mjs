import { env } from "node:process";
import { Client, GatewayIntentBits } from "npm:discord.js@14.26.4";

let debounce = {};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on("clientReady", () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.on("messageCreate", async message => {
    if( message.author.bot ) return;
    if( message.channel.id !== env.CHANNEL ) return;

    if( ! message.content.match(/youtu.be|youtube\.com/) && message.attachments.filter(attachment => attachment.contentType.startsWith("image/") || attachment.contentType.startsWith("video/")).size < 1 ){
        if( message.deletable ) await message.delete();
        
        if( debounce[message.author.id] ) return;
        debounce[message.author.id] = true;
        try {
            await (await client.users.fetch(message.author.id)).send(`Only YouTube links and image/video attachments are allowed in <#${env.CHANNEL}>.`);
        } catch(e) {
            console.error(`Failed to send DM to user ${message.author.id}:`, e);
        }
    }
});

client.login(env.TOKEN);

setInterval(() => debounce = {}, 1000 * 30);