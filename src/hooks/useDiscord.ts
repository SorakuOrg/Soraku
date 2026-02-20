import { useState, useEffect, useCallback } from 'react';
import { 
  fetchServerWidget, 
  sendDiscordWebhook, 
  type DiscordEmbed,
  DISCORD_COLORS,
  SORAKU_SERVER 
} from '@/lib/discord';

// Hook for Discord server widget
export function useDiscordWidget(serverId?: string) {
  const [widgetData, setWidgetData] = useState<{
    id: string;
    name: string;
    instant_invite: string;
    channels: { id: string; name: string; position: number }[];
    members: { id: string; username: string; status: string; avatar_url: string; game?: { name: string } }[];
    presence_count: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWidget = useCallback(async () => {
    if (!serverId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchServerWidget(serverId);
      if (data) {
        setWidgetData(data);
      } else {
        setError('Failed to fetch widget data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    fetchWidget();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchWidget, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchWidget]);

  return {
    widgetData,
    isLoading,
    error,
    refresh: fetchWidget,
    onlineCount: widgetData?.presence_count || 0,
    members: widgetData?.members || [],
    inviteUrl: widgetData?.instant_invite || SORAKU_SERVER.inviteUrl,
  };
}

// Hook for Discord webhook
export function useDiscordWebhook(webhookUrl?: string) {
  const [isSending, setIsSending] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: {
      content?: string;
      embeds?: DiscordEmbed[];
      username?: string;
      avatar_url?: string;
    }
  ) => {
    if (!webhookUrl) {
      setLastError('Webhook URL not configured');
      return false;
    }

    setIsSending(true);
    setLastError(null);

    try {
      await sendDiscordWebhook(webhookUrl, message);
      return true;
    } catch (err) {
      setLastError(err instanceof Error ? err.message : 'Failed to send message');
      return false;
    } finally {
      setIsSending(false);
    }
  }, [webhookUrl]);

  const sendBlogPost = useCallback(async (post: {
    title: string;
    excerpt: string;
    url: string;
    author: string;
    category: string;
    imageUrl?: string;
  }) => {
    const embed: DiscordEmbed = {
      title: post.title,
      description: post.excerpt,
      url: post.url,
      color: DISCORD_COLORS.primary,
      author: {
        name: post.author,
      },
      footer: {
        text: `Kategori: ${post.category}`,
      },
      timestamp: new Date().toISOString(),
    };

    if (post.imageUrl) {
      embed.image = { url: post.imageUrl };
    }

    return sendMessage({
      content: '📝 Artikel baru telah dipublikasikan!',
      embeds: [embed],
    });
  }, [sendMessage]);

  const sendEvent = useCallback(async (event: {
    title: string;
    description: string;
    url: string;
    startDate: string;
    location?: string;
    imageUrl?: string;
  }) => {
    const embed: DiscordEmbed = {
      title: `📅 ${event.title}`,
      description: event.description,
      url: event.url,
      color: DISCORD_COLORS.accent,
      fields: [
        {
          name: '📆 Tanggal',
          value: new Date(event.startDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    if (event.location) {
      embed.fields?.push({
        name: '📍 Lokasi',
        value: event.location,
        inline: true,
      });
    }

    if (event.imageUrl) {
      embed.image = { url: event.imageUrl };
    }

    return sendMessage({
      content: '🎉 Event baru telah dibuat!',
      embeds: [embed],
    });
  }, [sendMessage]);

  return {
    sendMessage,
    sendBlogPost,
    sendEvent,
    isSending,
    lastError,
  };
}

// Hook for Discord invite
export function useDiscordInvite() {
  const inviteUrl = SORAKU_SERVER.inviteUrl;

  const openInvite = useCallback(() => {
    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
  }, [inviteUrl]);

  const copyInviteLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      return true;
    } catch {
      return false;
    }
  }, [inviteUrl]);

  return {
    inviteUrl,
    openInvite,
    copyInviteLink,
  };
}

// Hook for Discord user presence
export function useDiscordPresence(serverId?: string) {
  const { widgetData, isLoading, error } = useDiscordWidget(serverId);

  const onlineMembers = widgetData?.members?.filter(
    (m) => m.status === 'online'
  ) || [];

  const idleMembers = widgetData?.members?.filter(
    (m) => m.status === 'idle'
  ) || [];

  const dndMembers = widgetData?.members?.filter(
    (m) => m.status === 'dnd'
  ) || [];

  const gamingMembers = widgetData?.members?.filter(
    (m) => m.game?.name
  ) || [];

  return {
    isLoading,
    error,
    totalOnline: widgetData?.presence_count || 0,
    onlineMembers,
    idleMembers,
    dndMembers,
    gamingMembers,
    allMembers: widgetData?.members || [],
  };
}
