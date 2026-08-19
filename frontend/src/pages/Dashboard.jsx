import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import styles from '../styles/dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [monitoring, setMonitoring] = useState('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchUrls = async () => {
    try {
      const res = await client.get('/urls');
      setUrls(res.data.urls || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      } else {
        setError('Failed to load URLs.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsCreating(true);
    setError('');
    try {
      await client.post('/create', { url: newUrl, monitoring });
      setNewUrl('');
      setMonitoring('daily');
      fetchUrls(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    // In a session based auth, we typically call a logout endpoint. 
    // If none exists, we just clear cookies or redirect.
    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Links</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>Sign Out</button>
      </header>

      <section className={`glass-panel ${styles.createSection}`}>
        <form className={styles.form} onSubmit={handleCreate}>
          <input
            type="url"
            className={styles.input}
            placeholder="Paste a long URL here (e.g., https://example.com/very/long/path)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            required
          />
          <select 
            className={styles.input} 
            style={{ flex: '0 0 auto', cursor: 'pointer', appearance: 'auto' }}
            value={monitoring}
            onChange={(e) => setMonitoring(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="hourly">Hourly</option>
            <option value="minutely">Minutely</option>
          </select>
          <button type="submit" className={styles.button} disabled={isCreating}>
            {isCreating ? 'Shortening...' : 'Shorten'}
          </button>
        </form>
        {error && <div style={{ color: 'var(--error-color)', marginTop: '1rem', fontSize: '0.875rem' }}>{error}</div>}
      </section>

      <section className={styles.urlsSection}>
        <h2 className={styles.sectionTitle}>Recent Links</h2>
        
        {isLoading ? (
          <div className={styles.emptyState}>Loading...</div>
        ) : urls.length === 0 ? (
          <div className={styles.emptyState}>
            You haven't shortened any links yet. Create one above!
          </div>
        ) : (
          <div className={styles.grid}>
            {urls.map((url) => (
              <div key={url.id} className={`glass-panel ${styles.urlCard}`}>
                <div className={styles.originalUrl} title={url.url}>
                  {url.url}
                </div>
                <a 
                  href={`/api/${url.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.shortUrl}
                >
                  {window.location.host}/api/{url.id}
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
