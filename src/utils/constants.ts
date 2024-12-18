import { GatewayIntentBits, Partials, PermissionFlagsBits } from "discord.js";

/**
 * The default permissions required to execute bot commands.
 * 
 * @constant
 * @type {readonly bigint[]}
 * @default [PermissionFlagsBits.ManageGuild]
 * @see {@link PermissionFlagsBits}
 */
export const DEFAULT_COMMAND_PERMISSIONS: readonly bigint[] = [PermissionFlagsBits.ManageGuild];

/**
 * Specifies whether commands are allowed to be used in Direct Messages (DMs) by default.
 * 
 * @constant
 * @type {boolean}
 * @default false
 */
export const DEFAULT_DM_PERMISSION: boolean = false;

/**
 * The default Gateway Intents required by the Discord client to function.
 * These intents define the types of events the bot will listen to.
 * 
 * @constant
 * @type {readonly GatewayIntentBits[]}
 * @default [
 *     GatewayIntentBits.Guilds,
 *     GatewayIntentBits.GuildIntegrations,
 *     GatewayIntentBits.GuildMessages,
 *     GatewayIntentBits.GuildMessageReactions,
 *     GatewayIntentBits.GuildMembers,
 *     GatewayIntentBits.DirectMessages,
 *     GatewayIntentBits.MessageContent
 * ]
 * @see {@link GatewayIntentBits}
 */
export const DEFAULT_CLIENT_INTENTS: readonly GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
];

/**
 * A flag used to send silent messages in Discord.
 * 
 * Silent messages are not notified to the recipients, minimizing disturbances.
 * 
 * @constant
 * @type {number}
 * @default 4096
 */
export const SILENT_MESSAGE: number = 4096;

/**
 * The default partials used by the Discord client.
 * Partials represent incomplete data that the bot can fetch later if needed.
 * 
 * @constant
 * @type {Partials[]}
 * @default []
 * @see {@link Partials}
 */
export const DEFAULT_CLIENT_PARTIALS: Partials[] = [];
