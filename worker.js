addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Ganti dengan kunci API Google Sheets API Anda
  const apiKey = 'AIzaSyCfqFCbHNQtGjxld0GW4511ClYPzUgEdGc';

  // Ambil parameter dari URL query
  const url = new URL(request.url);
  const spreadsheetId = url.searchParams.get('spreadsheetId');
  const sheetName = url.searchParams.get('sheetName');

  // Periksa apakah spreadsheetId dan sheetName tersedia
  if (!spreadsheetId || !sheetName) {
    return new Response('Contoh https://api.ronnieaban.workers.dev/?spreadsheetId=1AhRiyMazpSLJBoJ7l32jyLQwZVdCkAJC6_UbL-mTxE8&sheetName=Kalimantan.', { status: 400 });
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

  // Kirim respons dengan data yang telah diambil
  return new Response(JSON.stringify(jsonData), {
    headers: { 'Content-Type': 'application/json' },
  });
}
