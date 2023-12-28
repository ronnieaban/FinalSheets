const CACHE_DURATION = 5; // Cache duration in seconds

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event));
});

async function handleRequest(request, event) {
  // Check if the response is already in the cache
  const cache = caches.default;
  const cachedResponse = await cache.match(request.url);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Ganti dengan kunci API Google Sheets API Anda
  const apiKey = 'GOOGLE_API_KEY';

  // Ambil parameter dari URL query
  const url = new URL(request.url);
  const spreadsheetId = url.searchParams.get('spreadsheetId');
  const sheetName = url.searchParams.get('sheetName');

  // Periksa apakah spreadsheetId dan sheetName tersedia
  if (!spreadsheetId || !sheetName) {
    return new Response('Contoh https://api.ronnieaban.workers.dev/?spreadsheetId=1AhRiyMazpSLJBoJ7l32jyLQwZVdCkAJC6_UbL-mTxE8&sheetName=Kalimantan&filterColumn=Home%20State&filterValue=NY', { status: 400 });
  }

  // URL untuk mengakses Google Sheets API
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

  // Lakukan permintaan ke Google Sheets API
  const response = await fetch(apiUrl);

  // Periksa apakah permintaan berhasil
  if (!response.ok) {
    return new Response('Gagal mengambil data dari Google Sheets API', { status: response.status });
  }

  // Ambil data dari respons
  const data = await response.json();

  // Ubah data menjadi format JSON standar
  const values = data.values;
  const headers = values.shift(); // Ambil baris pertama sebagai header kolom
  const jsonData = values.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || null;
    });
    return obj;
  });

  // Ambil parameter filter dari URL query
  const filterColumn = url.searchParams.get('filterColumn');
  const filterValue = url.searchParams.get('filterValue');

  // Inisialisasi jsonHeaders di luar kondisi if
  let jsonHeaders;

  // Jika filterColumn dan filterValue ada, lakukan filtering
  if (filterColumn && filterValue) {
    // Filter data berdasarkan kolom dan nilai yang diberikan
    const filteredData = jsonData.filter((row) => row[filterColumn] === filterValue);

    // Buat respons JSON dari data yang telah difilter
    jsonHeaders = { 'Content-Type': 'application/json' };
    const filteredJsonResponse = new Response(JSON.stringify(filteredData), { headers: jsonHeaders });

    // Set header Cache-Control untuk memberikan informasi caching pada sisi browser
    filteredJsonResponse.headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}`);

    // Kirim respons dengan data yang telah difilter
    return filteredJsonResponse;
  }

  // Jika tidak ada filterColumn dan filterValue, kirim respons dengan data asli
  jsonHeaders = { 'Content-Type': 'application/json' };
  const jsonResponse = new Response(JSON.stringify(jsonData), { headers: jsonHeaders });
  event.waitUntil(cache.put(request.url, jsonResponse.clone()));

  // Atur header Cache-Control untuk memberikan informasi caching pada sisi browser
  jsonResponse.headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}`);

  // Kirim respons dengan data yang telah diambil
  return jsonResponse;
}
