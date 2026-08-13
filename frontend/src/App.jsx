import React, { useState } from 'react';
import { fetchGoodreadsData } from '../books.js';

function App() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);

  const handleFetchBook = async () => {
    if (!urlInput.trim()) return;

    setLoading(true);
    const data = await fetchGoodreadsData(urlInput);
    setBook(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📚 Librarian</h1>

      {/* Input Field & Button */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Paste Goodreads URL or search title..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleFetchBook}
          disabled={loading}
          style={{ padding: '10px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          {loading ? 'Fetching...' : 'Get Book'}
        </button>
      </div>

      {/* Display Book Details */}
      {book && (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9' }}>
          {book.title && <h2 style={{ marginTop: 0 }}>{book.title}</h2>}

          {/* Star Rating */}
          {book.rating && (
            <p style={{ fontWeight: 'bold' }}>
              Rating: ⭐ {book.rating} / 5
            </p>
          )}

          {/* Genre Tags */}
          {book.genres && book.genres.length > 0 && (
            <div style={{ margin: '12px 0' }}>
              <span style={{ fontWeight: 'bold', marginRight: '6px' }}>Genres:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {book.genres.map((genre, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#e0e0e0',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.85em',
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Book Blurb */}
          {book.blurb && (
            <div style={{ marginTop: '16px' }}>
              <span style={{ fontWeight: 'bold' }}>Blurb:</span>
              <p style={{ lineHeight: '1.5', color: '#444' }}>{book.blurb}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
