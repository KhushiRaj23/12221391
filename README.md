# React URL Shortener Web App

## Overview
URL shortner is a fully functional, production-grade React web application for URL shortening, built as part of an assessment. It features robust error handling, analytics, and a custom logging middleware that integrates with a protected API.

## Features
- Shorten up to 5 URLs at once, with optional validity and custom shortcodes
- Client-side validation for all inputs
- Display of shortened URLs and their expiry
- Statistics page with click analytics for each short URL
- Client-side routing and redirection for short URLs
- Material UI for responsive, modern design
- All significant events/errors are logged to a protected API using a custom middleware

## Folder Structure
- `Logging Middleware/` — Contains the reusable logging middleware (JavaScript)
- `Frontend Test Submission/frontend-test-submission/` — The React app (this project)

## Setup & Running the App
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000)

## Logging Middleware Integration
- The app uses a custom logger that sends logs to the protected API endpoint.
- To enable logging, you must provide your Bearer token (obtained via registration/authentication as per the assignment instructions).
- In `src/App.js`, replace the placeholder token with your actual token:
  ```js
  const [token] = useState('YOUR_ACCESS_TOKEN_HERE');
  ```
- All log events (info, warn, error) are sent with this token in the Authorization header.
<img width="1380" height="872" alt="image" src="https://github.com/user-attachments/assets/1a6adc9b-524c-43e0-88b1-ee3c1bf67fb2" />

## Usage
- **Shorten URLs:** Enter up to 5 URLs, with optional validity (in minutes) and custom shortcodes. Submit to generate short links.
- **Redirection:** Click a short link or visit `/s/[shortcode]` to be redirected to the original URL.
- **Statistics:** View all generated short URLs and their click analytics on the Statistics page.

<img width="1911" height="803" alt="image" src="https://github.com/user-attachments/assets/fc74f17f-fc9a-4d62-b258-12afb83fb912" />
<img width="1917" height="994" alt="image" src="https://github.com/user-attachments/assets/4a279dac-c45e-430c-a0ac-35efdf027b78" />
