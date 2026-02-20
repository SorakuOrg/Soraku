import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { fetchDiscordUser, getDiscordAuthUrl } from '@/lib/discord';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    login, 
    logout, 
    setLoading,
    updateUser,
    isAdmin,
    isModerator,
    canManageContent,
  } = useAuthStore();

  const { addToast } = useUIStore();

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      
      try {
        // Check if we have a stored session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user data from our users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('discord_id', session.user.user_metadata.provider_id)
            .single();

          if (error) {
            console.error('Failed to fetch user data:', error);
            logout();
          } else if (userData) {
            setUser({
              id: userData.id,
              discordId: userData.discord_id,
              username: userData.username,
              avatarUrl: userData.avatar_url,
              email: userData.email,
              role: userData.role,
              createdAt: userData.created_at,
            });
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [setUser, setLoading, logout]);

  // Handle Discord OAuth callback
  const handleDiscordCallback = useCallback(async (accessToken: string) => {
    setLoading(true);
    
    try {
      // Fetch Discord user data
      const discordUser = await fetchDiscordUser(accessToken);
      
      // Check if user exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('discord_id', discordUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let userData;

      if (!existingUser) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            discord_id: discordUser.id,
            username: discordUser.username,
            avatar_url: discordUser.avatar 
              ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
              : null,
            email: discordUser.email || null,
            role: 'member',
          })
          .select()
          .single();

        if (createError) throw createError;
        userData = newUser;
      } else {
        // Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            username: discordUser.username,
            avatar_url: discordUser.avatar 
              ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
              : existingUser.avatar_url,
            email: discordUser.email || existingUser.email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) throw updateError;
        userData = updatedUser;
      }

      // Login to store
      login(discordUser, accessToken);
      
      // Update with database data
      if (userData) {
        updateUser({
          id: userData.id,
          role: userData.role,
          createdAt: userData.created_at,
        });
      }

      addToast({
        title: 'Login Berhasil',
        description: `Selamat datang, ${discordUser.username}!`,
        type: 'success',
      });

      return true;
    } catch (error) {
      console.error('Discord login failed:', error);
      addToast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat login dengan Discord.',
        type: 'error',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [login, updateUser, setLoading, addToast]);

  // Initiate Discord login
  const initiateDiscordLogin = useCallback(() => {
    const authUrl = getDiscordAuthUrl();
    window.location.href = authUrl;
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      logout();
      addToast({
        title: 'Logout Berhasil',
        description: 'Anda telah keluar dari akun.',
        type: 'info',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      addToast({
        title: 'Logout Gagal',
        description: 'Terjadi kesalahan saat logout.',
        type: 'error',
      });
    }
  }, [logout, addToast]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        updateUser({
          username: data.username,
          avatarUrl: data.avatar_url,
          email: data.email,
          role: data.role,
        });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [user?.id, updateUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isModerator,
    canManageContent,
    handleDiscordCallback,
    initiateDiscordLogin,
    handleLogout,
    refreshUser,
  };
}

// Hook for protected routes
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      addToast({
        title: 'Akses Ditolak',
        description: 'Silakan login terlebih dahulu.',
        type: 'warning',
      });
      
      // Store current path for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      // Redirect to login
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo, addToast]);

  return { isAuthenticated, isLoading };
}

// Hook for admin-only routes
export function useRequireAdmin(redirectTo: string = '/') {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        addToast({
          title: 'Akses Ditolak',
          description: 'Silakan login terlebih dahulu.',
          type: 'warning',
        });
        window.location.href = '/login';
      } else if (user?.role !== 'admin') {
        addToast({
          title: 'Akses Ditolak',
          description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
          type: 'error',
        });
        window.location.href = redirectTo;
      }
    }
  }, [isAuthenticated, isLoading, user?.role, redirectTo, addToast]);

  return { isAuthenticated, isLoading, isAdmin: user?.role === 'admin' };
}
