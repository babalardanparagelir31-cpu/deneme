const mineflayer = require('mineflayer');
const { Client, GatewayIntentBits } = require('discord.js');

// -------------------------------------------------------------
// AYARLAR
// -------------------------------------------------------------
const DISCORD_TOKEN = 'MTU2MTQzNjQ0MTQ0NjQ0OTIwMw.G4dgPq.GMsV3uALO3uLhVEWuFSBimSP1ogpFXxexwCoqk';
const CHANNEL_ID = '1561436279873212516';

const MC_HOST = 'oyna.morukcraft.com';
const MC_PORT = 25565;
const MC_USERNAME = 'Adez1Marka';

// -------------------------------------------------------------
// 1. DISCORD BOT KURULUMU
// -------------------------------------------------------------
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

discordClient.once('clientReady', () => {
  console.log(`[Discord] ${discordClient.user.tag} olarak giriş yapıldı!`);
});

// -------------------------------------------------------------
// 2. MINECRAFT BOT KURULUMU
// -------------------------------------------------------------
let mcBot;

function createMcBot() {
  mcBot = mineflayer.createBot({
    host: MC_HOST,
    port: MC_PORT,
    username: MC_USERNAME,
    version: '1.20.1' // MorukCraft ağında en stabil çalışan alt sürüm
  });

  mcBot.on('spawn', () => {
    console.log(`[Minecraft] ${mcBot.username} sunucuya başarıyla bağlandı!`);
  });

  mcBot.on('end', (reason) => {
    console.log(`[Minecraft] Bağlantı kesildi: ${reason}. 10 sn sonra tekrar bağlanılıyor...`);
    setTimeout(createMcBot, 10000);
  });

  mcBot.on('error', (err) => {
    console.error('[Minecraft] Hata:', err);
  });
}

// Minecraft Botunu Başlat
createMcBot();

// -------------------------------------------------------------
// 3. DISCORD'DAN MINECRAFT'A MESAJ VE KOMUT AKTARIMI
// -------------------------------------------------------------
discordClient.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== CHANNEL_ID) return;

  if (mcBot && mcBot.entity) {
    const text = message.content.trim();

    // Eğer mesaj bir komut ise (örneğin /login veya /queue ile başlıyorsa)
    if (text.startsWith('/')) {
      mcBot.chat(text); 
      console.log(`[Komut Gönderildi]: ${text}`);
    } else {
      // Normal sohbet mesajı ise
      mcBot.chat(text);
      console.log(`[Mesaj Gönderildi]: ${text}`);
    }
  } else {
    console.log('[!] Mesaj aktarılamadı: Minecraft botu henüz sunucuda değil.');
  }
});

// Discord Botunu Başlat
discordClient.login('MTU2MTQzNjQ0MTQ0NjQ0OTIwMw.G4dgPq.GMsV3uALO3uLhVEWuFSBimSP1ogpFXxexwCoqk');