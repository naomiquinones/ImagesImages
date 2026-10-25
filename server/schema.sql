CREATE TABLE searches (
  id SERIAL PRIMARY KEY,
  term TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE search_cache (
  term TEXT NOT NULL,
  page INT NOT NULL,
  results JSONB NOT NULL,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (term, page)
);