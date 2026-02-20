import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

interface BlogState {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  currentPost: BlogPost | null;
  categories: string[];
  tags: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Actions
  fetchPosts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    status?: 'draft' | 'published' | 'archived';
    featured?: boolean;
    search?: string;
  }) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<BlogPost | null>;
  fetchFeaturedPosts: (limit?: number) => Promise<void>;
  createPost: (post: BlogPostInsert) => Promise<BlogPost | null>;
  updatePost: (id: string, updates: BlogPostUpdate) => Promise<BlogPost | null>;
  deletePost: (id: string) => Promise<boolean>;
  incrementViewCount: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  setCurrentPost: (post: BlogPost | null) => void;
}

export const useBlogStore = create<BlogState>()((set) => ({
  posts: [],
  featuredPosts: [],
  currentPost: null,
  categories: [],
  tags: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  fetchPosts: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const {
        page = 1,
        limit = 10,
        category,
        tag,
        status = 'published',
        featured,
        search,
      } = params;

      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' });

      // Apply filters
      if (status) query = query.eq('status', status);
      if (category) query = query.eq('category', category);
      if (featured !== undefined) query = query.eq('featured', featured);
      if (tag) query = query.contains('tags', [tag]);
      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order('featured', { ascending: false })
        .order('published_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      set({
        posts: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch posts',
        isLoading: false,
      });
    }
  },

  fetchPostBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      set({ currentPost: data, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch post',
        isLoading: false,
      });
      return null;
    }
  },

  fetchFeaturedPosts: async (limit = 5) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      set({ featuredPosts: data || [] });
    } catch (error) {
      console.error('Failed to fetch featured posts:', error);
    }
  },

  createPost: async (post) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();

      if (error) throw error;

      set({ isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create post',
        isLoading: false,
      });
      return null;
    }
  },

  updatePost: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set({ isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update post',
        isLoading: false,
      });
      return null;
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete post',
        isLoading: false,
      });
      return false;
    }
  },

  incrementViewCount: async (id) => {
    try {
      await supabase.rpc('increment_post_view', { post_id: id });
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('status', 'published');

      if (error) throw error;

      const categories = [...new Set(data?.map((p) => p.category) || [])];
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchTags: async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('status', 'published');

      if (error) throw error;

      const allTags = data?.flatMap((p) => p.tags || []) || [];
      const uniqueTags = [...new Set(allTags)];
      set({ tags: uniqueTags });
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  },

  setCurrentPost: (post) => set({ currentPost: post }),
}));
