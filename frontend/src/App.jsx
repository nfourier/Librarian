import { useMemo, useState } from 'react';
import { BookOpen, Heart, Star, Search, Sparkles, Upload, Library, Smartphone, Database, ShieldCheck } from 'lucide-react';

const starterBooks = [
  {
    id: 'sample-1',
    title: 'Example Imported Book',
    author: 'Jane Author',
    status: 'unread',
    detailsStatus: 'complete',
    liked: false,
    favorite: true,
    tags: ['fantasy', 'slow burn', 'found family'],
    blurb: 'A sample card showing how a fully enriched catalogue item will look.'
  },
  {
    id: 'sample-2',
    title: 'Needs Details Example',
    author: 'Unknown Author',
    status: 'unread',
    detailsStatus: 'needs_details',
    liked: false,
    favorite: false,
    tags: ['needs match'],
    blurb: 'This book is still in your catalogue. It only needs enrichment or a manual match.'
  },
  {
    id: 'sample-3',
    title: 'Cozy Mystery Sample',
    author: 'A. Writer',
    status: 'reading',
    detailsStatus: 'complete',
    liked: true,
    favorite: false,
    tags: ['mystery', 'cozy', 'small town'],
    blurb: 'A light sample used by the Librarian recommendation area.'
  }
];

const filters = ['All', 'Unread', 'Reading', 'Finished', 'Liked', 'Favorites', 'Needs details'];

function statusLabel(status) {
  if (status === 'unread') return 'Unread';
  if (status === 'reading') return 'Reading';
  if (status === 'finished') return 'Finished';
  return status;
}

function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function BookCard({ book, onToggleLiked, onToggleFavorite, onStatusChange }) {
  return (
    <article className="book-card">
      <div className="card-topline">
        <div className="badges">
          <Badge tone="good">In catalog</Badge>
          <Badge tone={book.detailsStatus === 'complete' ? 'good' : 'warn'}>
            {book.detailsStatus === 'complete' ? 'Details filled' : 'Needs details'}
          </Badge>
          <Badge>{statusLabel(book.status)}</Badge>
        </div>
      </div>

      <h3>{book.title}</h3>
      <p className="author">{book.author || 'Author unknown'}</p>
      <p className="blurb">{book.blurb}</p>

      <div className="tags">
        {book.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>

      <div className="card-actions">
        <button onClick={() => onToggleLiked(book.id)} className={book.liked ? 'active-icon' : ''}>
          <Heart size={17} fill={book.liked ? 'currentColor' : 'none'} /> {book.liked ? 'Liked' : 'Like'}
        </button>
        <button onClick={() => onToggleFavorite(book.id)} className={book.favorite ? 'active-icon' : ''}>
          <Star size={17} fill={book.favorite ? 'currentColor' : 'none'} /> {book.favorite ? 'Favorite' : 'Favorite'}
        </button>
        <select value={book.status} onChange={(event) => onStatusChange(book.id, event.target.value)}>
          <option value="unread">Unread</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
      </div>
    </article>
  );
}

export default function App() {
  const [books, setBooks] = useState(starterBooks);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [mood, setMood] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      const haystack = [book.title, book.author, book.status, ...book.tags].join(' ').toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Unread' && book.status === 'unread') ||
        (filter === 'Reading' && book.status === 'reading') ||
        (filter === 'Finished' && book.status === 'finished') ||
        (filter === 'Liked' && book.liked) ||
        (filter === 'Favorites' && book.favorite) ||
        (filter === 'Needs details' && book.detailsStatus !== 'complete');
      return matchesQuery && matchesFilter;
    });
  }, [books, query, filter]);

  const stats = {
    total: books.length,
    unread: books.filter((book) => book.status === 'unread').length,
    needsDetails: books.filter((book) => book.detailsStatus !== 'complete').length,
    signals: books.filter((book) => book.liked || book.favorite).length
  };

  function toggleLiked(id) {
    setBooks((rows) => rows.map((book) => book.id === id ? { ...book, liked: !book.liked } : book));
  }

  function toggleFavorite(id) {
    setBooks((rows) => rows.map((book) => book.id === id ? { ...book, favorite: !book.favorite } : book));
  }

  function changeStatus(id, status) {
    setBooks((rows) => rows.map((book) => book.id === id ? { ...book, status } : book));
  }

  function recommendFromLibrary() {
    const q = mood.trim().toLowerCase();
    let pool = books.filter((book) => book.status === 'unread');
    if (q) {
      const matched = pool.filter((book) => [book.title, book.author, ...book.tags, book.blurb].join(' ').toLowerCase().includes(q));
      if (matched.length) pool = matched;
    }
    const pick = pool[0];
    if (!pick) {
      setRecommendation('No unread books found yet.');
      return;
    }
    setRecommendation(`Try “${pick.title}”${pick.author ? ` by ${pick.author}` : ''}. This recommendation came only from your catalogue.`);
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <div className="eyebrow"><Library size={18} /> Librarien PWA frontend</div>
          <h1>Your private reading catalogue</h1>
          <p>
            This is the clean React starter. It keeps the core rule: imported books are in the catalogue, while missing enrichment is only marked as Needs details.
          </p>
        </div>
        <div className="hero-actions">
          <button><Upload size={17} /> Import CSV</button>
          <button className="primary"><Sparkles size={17} /> Fill details</button>
        </div>
      </header>

      <section className="stats-grid">
        <div><strong>{stats.total}</strong><span>Total books</span></div>
        <div><strong>{stats.unread}</strong><span>Unread</span></div>
        <div><strong>{stats.needsDetails}</strong><span>Need details</span></div>
        <div><strong>{stats.signals}</strong><span>Liked/Favorites</span></div>
      </section>

      <main className="content-grid">
        <section>
          <div className="search-card">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, author, status, keywords..." />
          </div>

          <div className="filters">
            {filters.map((item) => (
              <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>

          <div className="book-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onToggleLiked={toggleLiked}
                onToggleFavorite={toggleFavorite}
                onStatusChange={changeStatus}
              />
            ))}
          </div>
        </section>

        <aside>
          <section className="side-card librarian-card">
            <h2><BookOpen size={20} /> Librarian</h2>
            <p>Default mode recommends from your own catalogue only.</p>
            <input value={mood} onChange={(event) => setMood(event.target.value)} placeholder="Mood or keyword" />
            <button className="primary full" onClick={recommendFromLibrary}>Recommend from my library</button>
            {recommendation && <div className="recommendation">{recommendation}</div>}
          </section>

          <section className="side-card checklist">
            <h2>Next architecture</h2>
            <p><Smartphone size={17} /> Installable PWA for phone and desktop.</p>
            <p><Database size={17} /> Hosted database later, not browser-only data.</p>
            <p><ShieldCheck size={17} /> API keys stay on backend only.</p>
          </section>
        </aside>
      </main>
    </div>
  );
}
