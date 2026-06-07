export async function fetchData(path) {
  const url = `${window.BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url}`);
  return res.json();
}
