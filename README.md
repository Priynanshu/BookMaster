<img width="1366" height="768" alt="Screenshot (334)" src="https://github.com/user-attachments/assets/795410de-0ae0-4689-9801-d066c69f3553" /><img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/9daee3fd-29ff-4478-adfe-827666997988" /># 📚 BookMaster — Personal Knowledge Management App

A full-stack AI-powered app to save, organize, and resurface anything from the internet.

## 🚀 Features

- 🔗 **Save Anything** — Articles, Videos, Tweets, PDFs, Images
- 🤖 **AI Auto-tagging** — Automatic tags using Cohere AI
- 📝 **AI Summary** — Auto-generated summaries
- 🔍 **Semantic Search** — Find content by meaning, not just keywords
- 🕸️ **Knowledge Graph** — Visual connections between saved items
- 📁 **Collections** — Organize items into folders
- 💡 **Highlights** — Save important quotes
- 🧠 **Memory Resurfacing** — "You saved this 30 days ago"
- 🔗 **Browser Extension** — Save with one click
- 
- 📄 **PDF Upload** — Upload and analyze PDFs

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- D3.js (Knowledge Graph)

### Backend
- Node.js + Express
- Redis (token BlackListing)
- MongoDB Atlas
- Cohere AI (Embeddings + Tags)
- Cloudinary (PDF Storage)
- Cheerio (Web Scraping)

## 📦 Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Add your credentials
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_secret
COHERE_API_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## 🌐 Live LINK
- book-master-ruddy.vercel.app


## 👨‍💻 Author
Made with ❤️ by Priyanshu Pandey
