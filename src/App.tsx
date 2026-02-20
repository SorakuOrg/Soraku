import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Login } from '@/pages/Login';
import { BlogList, BlogDetail } from '@/pages/Blog';
import { EventList, EventDetail } from '@/pages/Events';
import { Community } from '@/pages/Community';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { Admin } from '@/pages/Admin';

function App() {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    // Set dark mode as default
    setTheme('dark');
  }, [setTheme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
