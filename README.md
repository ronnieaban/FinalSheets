
# sheetsJSON
Google Sheets API Fetcher using Cloudflare Workers

This Cloudflare Workers script retrieves data from a Google Sheets spreadsheet using the Google Sheets API. The script accepts parameters such as spreadsheetId and sheetName through URL query parameters and fetches the corresponding data. The retrieved data is then transformed into a standard JSON format and returned as the HTTP response.

**Usage:**
Deploy the Cloudflare Workers script using Wrangler or the Cloudflare dashboard. Access the endpoint with the necessary parameters in the URL query:

    https://your-workers-subdomain.youraccount.workers.dev/?spreadsheetId=YOUR_SPREADSHEET_ID&sheetName=Sheet1

Replace your-workers-subdomain.youraccount.workers.dev with your actual Cloudflare Workers subdomain.

*Example*

    https://api.ronnieaban.workers.dev/?spreadsheetId=1AhRiyMazpSLJBoJ7l32jyLQwZVdCkAJC6_UbL-mTxE8&sheetName=Kalimantan

**Features:**

 - Utilizes the Google Sheets API to fetch data based on provided
   parameters.
 - Transforms the retrieved data into a standard JSON format.
 - Allows easy integration into web applications or services requiring dynamic data from Google Sheets.

**How to Deploy:**

1. Install Wrangler and configure it with your Cloudflare account.
2. Run wrangler publish to deploy the script to Cloudflare Workers.
   
    Important:
 - Ensure that the Google Sheets API key is correctly set in the script.
 - Customize the script as needed, adjusting the API key, URL parameters, and response formatting according to your specific requirements.

