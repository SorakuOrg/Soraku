// Discord OAuth2 Configuration
export const DISCORD_CONFIG = {
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_DISCORD_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_DISCORD_REDIRECT_URI || 'http://localhost:5173/auth/callback',
  scope: 'identify email guilds',
};

// Discord OAuth2 URL Generator
export const getDiscordAuthUrl = (state?: string) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CONFIG.clientId,
    redirect_uri: DISCORD_CONFIG.redirectUri,
    response_type: 'token',
    scope: DISCORD_CONFIG.scope,
    state: state || generateRandomState(),
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
};

// Generate random state for OAuth security
const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Discord User Type
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  verified?: boolean;
}

// Fetch Discord User Data
export const fetchDiscordUser = async (accessToken: string): Promise<DiscordUser> => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user');
  }

  return response.json();
};

// Get Discord Avatar URL
export const getDiscordAvatarUrl = (userId: string, avatarHash: string | null, discriminator: string): string => {
  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=256`;
  }
  // Default avatar based on discriminator
  const defaultIndex = parseInt(discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
};

// Discord Server Info (Soraku Server)
export const SORAKU_SERVER = {
  id: import.meta.env.VITE_DISCORD_SERVER_ID || '',
  inviteUrl: import.meta.env.VITE_DISCORD_INVITE_URL || 'https://discord.gg/soraku',
  widgetUrl: (serverId: string) => `https://discord.com/api/guilds/${serverId}/widget.json`,
};

// Fetch Server Widget Data
export const fetchServerWidget = async (serverId: string) => {
  try {
    const response = await fetch(SORAKU_SERVER.widgetUrl(serverId));
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
};

// Discord Webhook Types
export interface DiscordWebhook {
  id: string;
  token: string;
  name?: string;
  avatar?: string;
  channel_id?: string;
  guild_id?: string;
}

// Send Webhook Message
export const sendDiscordWebhook = async (
  webhookUrl: string,
  message: {
    content?: string;
    embeds?: DiscordEmbed[];
    username?: string;
    avatar_url?: string;
  }
) => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error('Failed to send Discord webhook');
  }

  return response;
};

// Discord Embed Type
export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: { text: string; icon_url?: string };
  image?: { url: string };
  thumbnail?: { url: string };
  author?: { name: string; url?: string; icon_url?: string };
  fields?: { name: string; value: string; inline?: boolean }[];
}

// Predefined embed colors
export const DISCORD_COLORS = {
  primary: 0x4FA3D1,    // Soraku Primary
  secondary: 0x6E8FA6,  // Soraku Secondary
  accent: 0xE8C2A8,     // Soraku Accent
  success: 0x57F287,
  warning: 0xFEE75C,
  error: 0xED4245,
  info: 0x5865F2,
};
