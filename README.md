# BookMaster

Build your second digital brain. Save, organize, and resurface anything from the internet with the help of AI.

## About The Project

BookMaster is a full stack platform that lets you save articles, videos, tweets, images, and PDFs from anywhere on the web, then automatically organizes them using AI. Instead of links disappearing into a bookmarks folder you never open again, BookMaster understands what you saved, tags it, summarizes it, and makes it searchable by meaning rather than exact keywords.

## Features

* **Save Anything**: Articles, videos, tweets, PDFs, and images, all from one place.
* **AI Automatic Tagging**: Gemini AI generates relevant tags for every saved item.
* **AI Summary**: Each item gets a short, automatically generated summary.
* **Semantic Search**: Find content by meaning, powered by vector embeddings, not just keyword matching.
* **Knowledge Graph**: A visual map of your saved items, connected through shared tags.
* **Collections**: Group related items into custom folders with icons and colors.
* **Highlights**: Save important quotes or notes against any item.
* **Memory Resurfacing**: Get reminded of items you saved 7, 30, or 90 days ago.
* **Browser Extension**: Save the current page with a single click, right from Chrome.
* **PDF Upload**: Upload PDFs directly and have them analyzed by the same AI pipeline.

## Tech Stack

### Frontend
* React with Vite
* Redux Toolkit
* Tailwind CSS
* Framer Motion
* D3.js for the knowledge graph

### Backend
* Node.js with Express
* MongoDB Atlas, including Atlas Vector Search
* Redis, used for token blacklisting on logout
* Google Gemini API, used for tagging, summarization, and embeddings
* Cloudinary, used for PDF storage
* Cheerio, used for web scraping

### Extension
* Chrome Extension built with Manifest V3
* Syncs login state with the web app automatically

## Project Structure

```
BookMaster/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── pages/
│       └── services/
└── extension/
    ├── background.js
    ├── popup.html
    ├── popup.js
    └── manifest.json
```

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Extension

Open Chrome and go to chrome://extensions. Enable Developer Mode, click Load Unpacked, then select the extension folder.

## Environment Variables

Create a `.env` file inside the backend folder with the following values.

```env
PORT=3000
MONGO_URL=your_mongodb_uri
JWT_SECRET_KEY=your_secret
GEMINI_API_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
```

## How It Works

When you save a link, the backend scrapes the page to pull its title, description, and thumbnail. YouTube links are handled separately through the official oEmbed API. The extracted content is then sent to Gemini AI, which generates tags, a short summary, and a vector embedding, all in parallel to keep the save fast.

That embedding is stored in MongoDB Atlas and powers semantic search and the related items feature through Atlas Vector Search. The same tags also power the knowledge graph, which draws connections between items that share common tags using a force directed layout in D3.js.

## Live Links

Web App: https://book-master-ruddy.vercel.app

## Author

Made with care by Priyanshu Pandey
