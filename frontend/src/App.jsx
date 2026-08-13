import React, { useState, useEffect } from 'react';
import { fetchGoodreadsData } from '../books.js';

function App() {
  const [books, setBooks] = useState([
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', blurb: null, rating: null, genres: [] },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const autoSyncMissingGoodreadsData = async () => {
    setIsSyncing(true);
    const incompleteBooks = books.filter(b => !b.blurb || !b.rating);

    if (incompleteBooks.length === 0) {
      setSyncStatus('All books are up to date!');
      setIsSyncing(false);
      return;
    }

    setSyncStatus(`Syncing ${incompleteBooks.length} book(s)...`);
    const updatedBooks = [...books];

    for (let i = 0; i < updatedBooks.length; i++) {
      const book = updatedBooks[i];
      if (!book.blurb || !book.rating) {
        const searchQuery = `${book.title} ${book.author || ''}`;
        setSyncStatus(`Fetching info for "${book.title}"...`);
        const data = await fetchGoodreadsData(searchQuery);

        if (data && !data.error) {
          updatedBooks[i] = {
            ...book,
            blurb: book.blurb || data.blurb,
            rating: book.rating || data.rating,
            genres: (book.genres && book.genres.length > 0) ? book.genres : data.genres,
          };
        }
      }
    }

    setBooks(updatedBooks);
    setIsSyncing(false);
    setSyncStatus('Auto-sync complete!');
  };

  useEffect(() => {
    autoSyncMissingGoodreadsData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📚 Librarian Book Catalog</h2>

      <div style={{ marginBottom: '20px', padding: '12px', background: '#f0f4f8', borderRadius: '8px' }}>
        <button
          onClick={autoSyncMissingGoodreadsData}
          disabled={isSyncing}
          style={{
            padding: '10px 16px',
            background: isSyncing ? '#ccc' : '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isSyncing ? 'Syncing...' : '🔄 Auto-Sync Missing Goodreads Data'}
        </button>
        {syncStatus && <p style={{ fontSize: '14px', margin: '8px 0 0 0', color: '#555' }}>{syncStatus}</p>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 4px 0' }}>{book.title}</h3>
            {book.author && <p style={{ margin: '0 0 8px 0', color: '#666' }}>by {book.author}</p>}

            {book.rating ? (
              <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Rating: ⭐ {book.rating} / 5</p>
            ) : (
              <p style={{ margin: '4px 0', color: '#888' }}>Rating: Missing</p>
            )}

            {book.genres && book.genres.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', margin: '8px 0', flexWrap: 'wrap' }}>
                {book.genres.map((g, idx) => (
                  <span key={idx} style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
                    {g}
                  </span>
                ))}
              </div>
            )}

            {book.blurb ? (
              <p style={{ fontSize: '14px', lineHeight: '1.4', color: '#333', marginTop: '8px' }}>{book.blurb}</p>
            ) : (
              <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>Blurb: Missing (will auto-fetch)</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
