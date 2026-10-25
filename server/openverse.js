export async function searchImages(term, page = 1) {
  const params = new URLSearchParams({
    q: term,
    page: String(page),
    page_size: "20",
  });

  const url = `https://api.openverse.org/v1/images/?${params}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "ImagesImages/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Openverse returned ${response.status}`);
  }

  const data = await response.json();

  return data.results.map((r) => ({
    imageUrl: r.url,
    thumbnailUrl: r.thumbnail,
    description: r.title,
    pageUrl: r.foreign_landing_url,
    creator: r.creator,
    creatorUrl: r.creator_url,
    license: `${r.license} ${r.license_version}`,
    licenseUrl: r.license_url,
    attribution: r.attribution,
  }));
}