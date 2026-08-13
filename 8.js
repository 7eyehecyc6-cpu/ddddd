const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
const https = require('https');

const TOKEN = process.env.DISCORD_TOKEN || '';
const PORT = process.env.PORT || 8080;
const APP_URL = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || '';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('ready', () => {
    console.log(`✅ Bot 8.js [${client.user.tag}] đã online thành công!`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.content === '!ping') {
        message.reply('Pong! 🏓 Bot 8.js hoạt động ổn định trên Host.');
    }
});

const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'online', timestamp: new Date().toISOString() }));
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Bot 8.js Keep-Alive Server is Running!');
    }
});

server.listen(PORT, () => console.log(`[HTTP] Server 8.js listening on port ${PORT}`));

function startKeepAlivePing() {
    if (!APP_URL) return;
    const fullUrl = APP_URL.startsWith('http') ? APP_URL : `https://${APP_URL}`;
    const pingEndpoint = `${fullUrl.replace(/\/+$/, '')}/ping`;
    setInterval(() => {
        const requester = pingEndpoint.startsWith('https') ? https : http;
        requester.get(pingEndpoint, (res) => {}).on('error', (err) => {});
    }, 10 * 60 * 1000);
}

startKeepAlivePing();

if (TOKEN) {
    client.login(TOKEN).catch(err => {
        console.error('❌ Lỗi đăng nhập Discord Token:', err.message);
        process.exit(1);
    });
} else {
    console.error('❌ Thiếu DISCORD_TOKEN trong biến môi trường!');
    process.exit(1);
}