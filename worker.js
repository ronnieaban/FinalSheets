const CACHE_DURATION = 30; // Cache 30 detik

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event));
});

async function handleRequest(request, event) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: request.method, headers: request.headers });

  // Check if the response is already cached
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Replace with your Google Sheets API key
  const apiKey = 'GOOGLE_API_KEY';

  // Extract parameters from the URL query
  const url = new URL(request.url);
  const spreadsheetId = url.searchParams.get('spreadsheetId');
  const sheetName = url.searchParams.get('sheetName');

  // Check if spreadsheetId and sheetName are available
  if (!spreadsheetId || !sheetName) {
    return new Response('Example: https://satu.qarniuwaisal565.workers.dev/?spreadsheetId=1AhRiyMazpSLJBoJ7l32jyLQwZVdCkAJC6_UbL-mTxE8&sheetName=Kalimantan&filterColumn1=Home State&filterValue1=NY&filterColumn2=Major&filterValue2=Art', { status: 400 });
  }

  // URL to access Google Sheets API
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

  // Make a request to Google Sheets API
  const response = await fetch(apiUrl);

  // Check if the request is successful
  if (!response.ok) {
    return new Response('Failed to fetch data from Google Sheets API', { status: response.status });
  }

  // Extract data from the response
  const data = await response.json();
  const values = data.values;
  const headers = values.shift(); // Take the first row as column headers
  const jsonData = values.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || null;
    });
    return obj;
  });

  // Extract filter parameters from the URL query
  const filters = [];
  for (const [key, value] of url.searchParams.entries()) {
    if (key.startsWith('filterColumn') && value) {
      const filterNumber = key.substring(12);
      const filterColumn = value;
      const filterValue = url.searchParams.get(`filterValue${filterNumber}`);
      filters.push({ column: filterColumn, value: filterValue });
    }
  }

  // If there are filters, perform filtering
  if (filters.length > 0) {
    // Filter data based on the provided filters
    const filteredData = jsonData.filter((row) =>
      filters.every((filter) => row[filter.column] === filter.value)
    );

    // Create a JSON response from the filtered data
    const jsonHeaders = { 'Content-Type': 'application/json' };
    const filteredJsonResponse = new Response(JSON.stringify(filteredData), { headers: jsonHeaders });

    // Set Cache-Control header to provide caching information on the browser side
    filteredJsonResponse.headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}`);

    // Cache the filtered response
    event.waitUntil(cache.put(cacheKey, filteredJsonResponse.clone()));

    // Return the filtered response
    return filteredJsonResponse;
  }

  // If there are no filters, return the original data
  const jsonHeaders = { 'Content-Type': 'application/json' };
  const jsonResponse = new Response(JSON.stringify(jsonData), { headers: jsonHeaders });

  // Set Cache-Control header to provide caching information on the browser side
  jsonResponse.headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}`);

  // Cache the original response
  event.waitUntil(cache.put(cacheKey, jsonResponse.clone()));

  // Return the original response
  return jsonResponse;
}
