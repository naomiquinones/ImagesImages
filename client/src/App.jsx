import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [term, setTerm] = useState("");
  const [images, setImages] = useState([]);
  const [recent, setRecent] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRecent() {
    try {
      const response = await fetch("/recent");
      if (response.ok) {
        setRecent(await response.json());
      }
    } catch (error) {
      console.error("Could not load recent searches:", error);
    }
  }

  useEffect(() => {
    fetch("/recent")
      .then((res) => res.json())
      .then(setRecent)
      .catch(console.error);
  }, []);

  async function searchImages(searchTerm, newPage = 1) {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) return;

    setTerm(cleanTerm);
    setInput(cleanTerm);
    setPage(newPage);
    setLoading(true);
    setError("");
    setImages([]);

    try {
      const response = await fetch(
        `/query/${encodeURIComponent(cleanTerm)}?page=${newPage}`
      );

      if (!response.ok) {
        throw new Error("Unable to load images.");
      }

      const data = await response.json();
      setImages(data);

      if (newPage === 1) {
        await loadRecent();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchImages(input, 1);
  }

  return (
    <main>
      <h1>ImagesImages</h1>
      <p>Search openly licensed images from Openverse.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="search">Search images</label>
        <div className="search-form">
          <input
            id="search"
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Try cats, mountains, or flowers"
          />
          <button type="submit" disabled={loading}>
            Search
          </button>
        </div>
      </form>

      <p role="status" aria-live="polite">
        {loading
          ? "Loading images..."
          : error ||
            (term
              ? `Showing ${images.length} results for "${term}" — page ${page}`
              : "Enter a search term to begin.")}
      </p>

      <ul className="image-grid">
        {images.map((image, index) => (
          <li key={`${image.pageUrl}-${index}`}>
            <a
              href={image.pageUrl || image.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={image.thumbnailUrl || image.imageUrl}
                alt={image.description || "Untitled image"}
                loading="lazy"
              />
            </a>
            <p>{image.description || "Untitled image"}</p>
          </li>
        ))}
      </ul>

      {term && !loading && !error && (
        <nav className="pagination" aria-label="Result pages">
          <button
            disabled={page === 1}
            onClick={() => searchImages(term, page - 1)}
          >
            Previous
          </button>

          <span>Page {page}</span>

          <button
            disabled={page === 12 || images.length < 20}
            onClick={() => searchImages(term, page + 1)}
          >
            Next
          </button>
        </nav>
      )}

      <aside>
        <h2>Recent searches</h2>
        <ul>
          {recent.map((item, index) => (
            <li key={index}>
              <button onClick={() => searchImages(item.term, 1)}>
                {item.term}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}

export default App;