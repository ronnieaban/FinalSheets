const CACHE_DURATION = 5; // Cache 5 detik

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request, event));
});

async function handleRequest(request, event) {
  // Check jika response suda ter-cache
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
    return new Response('Contoh https://api.ronnieaban.workers.dev/?spreadsheetId=1AhRiyMazpSLJBoJ7l32jyLQwZVdCkAJC6_UbL-mTxE8&sheetName=Kalimantan&filterColumn1=Home State&filterValue1=NY&filterColumn2=Major&filterValue2=Art', { status: 400 });
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
  const filters = [];
  for (const [key, value] of url.searchParams.entries()) {
    if (key.startsWith('filterColumn') && value) {
      const filterNumber = key.substring(12);
      const filterColumn = value;
      const filterValue = url.searchParams.get(`filterValue${filterNumber}`);
      filters.push({ column: filterColumn, value: filterValue });
    }
  }

  // Jika ada filter, lakukan filtering
  if (filters.length > 0) {
    // Filter data berdasarkan filter yang diberikan
    const filteredData = jsonData.filter((row) =>
      filters.every((filter) => row[filter.column] === filter.value)
    );

    // Buat respons JSON dari data yang telah difilter
    const jsonHeaders = { 'Content-Type': 'application/json' };
    const filteredJsonResponse = new Response(JSON.stringify(filteredData), { headers: jsonHeaders });

    // Set header Cache-Control untuk memberikan informasi caching pada sisi browser
    filteredJsonResponse.headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}`);

    // Kirim respons dengan data yang telah difilter
    return filteredJsonResponse;
  }

  // Jika tidak ada filter, kirim respons dengan data asli
  const jsonHeaders = { 'Content-Type': 'application/json' };
  const jsonResponse = new Response(JSON.stringify(jsonData), { headers: jsonHeaders });
  event.waitUntil(cache.put(request.url, jsonResponse.clone()));

  // Atur header Cache-Control untuk memberikan informasi caching pada sisi browser
  jsonResponse.headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}`);

  // Kirim respons dengan data yang telah diambil
  return jsonResponse;
}
