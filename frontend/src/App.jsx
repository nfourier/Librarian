import React, { useState, useEffect } from 'react';
import { fetchGoodreadsData } from '../books.js';

export default function App() {
  // Your catalog state (replace with your loaded JSON catalog if using file loader)
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'Solace',
      author: 'Taylor McNiff',
      status: 'Unread',
      goodreadsStatus: 'Needs Goodreads',
      rating: null,
      blurb: null,
      genres: [],
    },
    {
      id: 2,
      title: 'Safe Book One of the Veterans of Callenburg Series',
      author: 'Author unknown',
      status: 'Unread',
      goodreadsStatus: 'Needs Goodreads',
      rating: null,
      blurb: null,
      genres: [],
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');

  // 🤖 AUTO-FETCH FUNCTION: Loops through all books marked 'Needs Goodreads'
  const handleAutoFetchGoodreads = async () => {
    setIsSyncing(true);

    const targetBooks = books.filter(
      (b) => b.goodreadsStatus === 'Needs Goodreads' || !b.blurb || !b.rating
    );

    if (targetBooks.length === 0) {
      setSyncProgress('All books already have Goodreads data!');
      setIsSyncing(false);
      return;
    }

    setSyncProgress(`Starting auto-fetch for ${targetBooks.length} book(s)...`);

    let updatedCatalog = [...books];

    for (let i = 0; i < updatedCatalog.length; i++) {
      const book = updatedCatalog[i];

      if (book.goodreadsStatus === 'Needs Goodreads' || !book.blurb || !book.rating) {
        setSyncProgress(`Fetching Goodreads data for "${book.title}"...`);

        try {
          const query = `${book.title} ${book.author && book.author !== 'Author unknown' ? book.author : ''}`;
          const fetched = await fetchGoodreadsData(query);

          if (fetched && !fetched.error) {
            updatedCatalog[i] = {
              ...book,
              rating: fetched.rating || book.rating,
              blurb: fetched.blurb || book.blurb,
              genres: fetched.genres?.length ? fetched.genres : book.genres,
              goodreadsStatus: 'Goodreads filled',
            };
            // Real-time update on screen
            setBooks([...updatedCatalog]);
          }
        } catch (err) {
          console.error(`Error fetching for ${book.title}:`, err);
        }
      }
    }

    setIsSyncing(false);
    setSyncProgress('✅ Auto-fetch completed!');
  };

  // Stats Calculations
  const totalCount = books.length;
  const unreadCount = books.filter((b) => b.status === 'Unread').length;
  const filledCount = books.filter((b) => b.goodreadsStatus === 'Goodreads filled').length;
  const needCount = books.filter((b) => b.goodreadsStatus === 'Needs Goodreads').length;

  // Filter Logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return book.status === 'Unread';
    if (activeFilter === 'Goodreads filled') return book.goodreadsStatus === 'Goodreads filled';
    if (activeFilter === 'Needs Goodreads') return book.goodreadsStatus === 'Needs Goodreads';
    return true;
  });

  return (
    <div style={styles.container}>
      {/* Top Header Panel */}
      <header style={styles.header}>
        <div>
          <span style={styles.badge}>LIBRARIAN</span>
          <h1 style={styles.title}>Your private reading catalogue</h1>
          <p style={styles.subtitle}>
            Add Goodreads info manually, or click Auto-Fetch to automatically fill missing blurbs & ratings.
          </p>
        </div>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button style={styles.btnSecondary}>Connect GitHub</button>
          <button style={styles.btnSecondary}>Save to GitHub</button>
          <button
            onClick={handleAutoFetchGoodreads}
            disabled={isSyncing}
            style={isSyncing ? styles.btnDisabled : styles.btnPrimary}
          >
            {isSyncing ? '⚡ Fetching...' : '⚡ Auto-Fetch Goodreads'}
          </button>
        </div>
      </header>

      {/* Progress Status Bar */}
      {syncProgress && (
        <div style={styles.progressBanner}>
          <p style={styles.progressText}>{syncProgress}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalCount}</div>
          <div style={styles.statLabel}>Total</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{unreadCount}</div>
          <div style={styles.statLabel}>Unread</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{filledCount}</div>
          <div style={styles.statLabel}>Goodreads filled</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{needCount}</div>
          <div style={styles.statLabel}>Need Goodreads</div>
        </div>
      </div>

      {/* Search Input */}
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="Search title, author, series, Goodreads keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Filter Buttons */}
      <div style={styles.filterPills}>
        {['All', 'Unread', 'Reading', 'Finished', 'Liked', 'Favorites', 'Goodreads filled', 'Needs Goodreads'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={activeFilter === filter ? styles.pillActive : styles.pill}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Books Display */}
      <div style={styles.booksGrid}>
        {filteredBooks.map((book) => (
          <div key={book.id} style={styles.bookCard}>
            <div style={styles.cardBadges}>
              <span style={styles.tagInCatalog}>in catalog</span>
              <span style={book.goodreadsStatus === 'Goodreads filled' ? styles.tagFilled : styles.tagNeeds}>
                {book.goodreadsStatus}
              </span>
            </div>

            <h3 style={styles.bookTitle}>{book.title}</h3>
            <p style={styles.bookAuthor}>{book.author}</p>

            {book.rating && <p style={styles.bookRating}>⭐ {book.rating} / 5</p>}

            {book.genres && book.genres.length > 0 && (
              <div style={styles.genreContainer}>
                {book.genres.map((g, idx) => (
                  <span key={idx} style={styles.genreTag}>{g}</span>
                ))}
              </div>
            )}

            {book.blurb ? (
              <p style={styles.bookBlurb}>{book.blurb}</p>
            ) : (
              <p style={styles.placeholderText}>Click Details or Auto-Fetch to add Goodreads info.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Brown Earthy Theme Styles (Matches Screenshot)
const styles = {
  container: {
    backgroundColor: '#2b2118',
    color: '#f5efe6',
    minHeight: '100vh',
    padding: '24px',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  badge: {
    fontSize: '11px',
    letterSpacing: '1.5px',
    color: '#d4a373',
    fontWeight: 'bold',
  },
  title: {
    margin: '4px 0 8px 0',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    color: '#cca483',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  btnSecondary: {
    backgroundColor: '#4a3b2c',
    color: '#f5efe6',
    border: '1px solid #6b5541',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  btnPrimary: {
    backgroundColor: '#4e6e5d',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  btnDisabled: {
    backgroundColor: '#666',
    color: '#ccc',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontSize: '13px',
  },
  progressBanner: {
    backgroundColor: '#3a2e22',
    borderLeft: '4px solid #4e6e5d',
    padding: '10px 16px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  progressText: {
    margin: 0,
    fontSize: '14px',
    color: '#e6ccb2',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#382c20',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #4a3b2c',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#f5efe6',
  },
  statLabel: {
    fontSize: '12px',
    color: '#cca483',
    marginTop: '4px',
  },
  searchSection: {
    marginBottom: '16px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '20px',
    border: '1px solid #4a3b2c',
    backgroundColor: '#1f1710',
    color: '#f5efe6',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  filterPills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  pill: {
    backgroundColor: '#382c20',
    color: '#cca483',
    border: '1px solid #4a3b2c',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  pillActive: {
    backgroundColor: '#d4a373',
    color: '#1f1710',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
  },
  bookCard: {
    backgroundColor: '#f5efe6',
    color: '#2b2118',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardBadges: {
    display: 'flex',
    gap: '6px',
    marginBottom: '8px',
  },
  tagInCatalog: {
    backgroundColor: '#e6ccb2',
    color: '#523d2d',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
  },
  tagNeeds: {
    backgroundColor: '#f8d7da',
    color: '#842029',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
  },
  tagFilled: {
    backgroundColor: '#d1e7dd',
    color: '#0f5132',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
  },
  bookTitle: {
    margin: '4px 0 2px 0',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  bookAuthor: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    color: '#6b5541',
  },
  bookRating: {
    margin: '4px 0',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  genreContainer: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    margin: '6px 0',
  },
  genreTag: {
    backgroundColor: '#ddb892',
    color: '#2b2118',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '8px',
  },
  bookBlurb: {
    fontSize: '12px',
    lineHeight: '1.4',
    color: '#4a3b2c',
    marginTop: '8px',
  },
  placeholderText: {
    fontSize: '12px',
    fontStyle: 'italic',
    color: '#8c7865',
    marginTop: '8px',
  },
};
