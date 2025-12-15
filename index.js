const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

let spamInterval = null;

const commands = [
  new SlashCommandBuilder()
    .setName("spam")
    .setDescription("Inicia o spam"),
  new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Para o spam")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
  console.log("Comandos registrados");
})();

client.once("ready", () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "spam") {
      if (spamInterval)
        return interaction.reply({ content: "Já ativo", ephemeral: true });

      spamInterval = setInterval(() => {
        const btn = new ButtonBuilder()
          .setCustomId("bonde")
          .setLabel("Clique aqui")
          .setStyle(ButtonStyle.Danger);

        interaction.channel.send({
          content: "👹 **Bonde do caos passou por aqui** 👹",
          components: [new ActionRowBuilder().addComponents(btn)]
        });
      }, 1000);

      return interaction.reply({ content: "🔥 Spam iniciado", ephemeral: true });
    }

    if (interaction.commandName === "stop") {
      clearInterval(spamInterval);
      spamInterval = null;
      return interaction.reply({ content: "🛑 Spam parado", ephemeral: true });
    }
  }

  if (interaction.isButton() && interaction.customId === "bonde") {
    await interaction.reply({ content: "👹 clicou 😈", ephemeral: true });
  }
});

client.login(TOKEN);
