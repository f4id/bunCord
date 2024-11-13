import { GatewayIntentBits, Partials, PermissionFlagsBits } from "discord.js";

/** The default permissions required to use commands. */
export const DEFAULT_COMMAND_PERMISSIONS: readonly bigint[] = [PermissionFlagsBits.ManageGuild];

/** The default state of whether commands should be allowed in DMs. */
export const DEFAULT_DM_PERMISSION: boolean = false;

/** The default intents for the Discord client. */
export const DEFAULT_CLIENT_INTENTS: readonly GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
];

/** The message flags to send silent messages. */
export const SILENT_MESSAGE: number = 4096;

/** The default partials for the Discord client. */
export const DEFAULT_CLIENT_PARTIALS: Partials[] = [];