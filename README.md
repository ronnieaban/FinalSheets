
# FinalSheets
Google Sheets API Fetcher using Cloudflare Workers

This Cloudflare Workers script retrieves data from a Google Sheets spreadsheet using the Google Sheets API. The script accepts parameters such as spreadsheetId and sheetName through URL query parameters and fetches the corresponding data. The retrieved data is then transformed into a standard JSON format and returned as the HTTP response.

**Usage:**
Deploy the Cloudflare Workers script using Wrangler or the Cloudflare dashboard. Access the endpoint with the necessary parameters in the URL query:

    https://your-workers-subdomain.youraccount.workers.dev/?spreadsheetId=YOUR_SPREADSHEET_ID&sheetName=YOUR_SHEET_NAME&filterColumn1=ColumnName1&filterValue1=ValueToFilter1&filterColumn2=ColumnName2&filterValue2=ValueToFilter2

Replace your-workers-subdomain.youraccount.workers.dev with your actual Cloudflare Workers subdomain.

*Example*

    https://api.ronnieaban.workers.dev/?spreadsheetId=1AhRiyMazpSLJBoJ7l32jyLQwZVdCkAJC6_UbL-mTxE8&sheetName=Kalimantan&filterColumn1=Home%20State&filterValue1=NY&filterColumn2=Major&filterValue2=Art

**Features:**
 - Utilizes the Google Sheets API to fetch data based on provided
   parameters.
 - Transforms the retrieved data into a standard JSON format.
 - Allows easy integration into web applications or services requiring dynamic data from Google Sheets.

**How to Get API Key and Share Google Sheets:**
1. Make Google API Key [Youtube](https://www.youtube.com/watch?v=brCkpzAD0gc)
2. Share your google sheets [Youtube](https://www.youtube.com/watch?v=CNN967bemQg&t=256s) **File, Share, Share with Others and at General Access** change Restricted to **Anyone with the link** 

**How to Deploy:**
Put this code in the Cloudflare Worker, save and deploy 
   
**Important:**
 - Ensure that the Google Sheets API key is correctly set in the script.
 - Customize the script as needed, adjusting the API key, URL parameters, and response formatting according to your specific requirements.

