const express = require("express")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const errorHandler = require("./middlewares/errorHandler.middleware")
const authRoutes = require("./routes/auth.routes")
const itemRoutes = require("./routes/items.routes")
const searchRoutes = require("./routes/search.routes")
const collectionRoutes = require("./routes/collections.routes")
const statsRoutes = require("./routes/stats.routes")
const graphRoutes = require("./routes/graph.routes")
const cors = require("cors")

const app = express()

app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(cors({
   origin: [
    "http://localhost:5173",                
    "https://book-master-ruddy.vercel.app",
    "chrome-extension://*",
  ],
    credentials: true
}))

const { startResurfacingJob } = require("./services/resurfacing");
startResurfacingJob();

app.use("/api/auth", authRoutes)
app.use("/api/items", itemRoutes);
app.use("/api/search", searchRoutes)
app.use("/api/collections", collectionRoutes);

app.use("/api/stats", statsRoutes);
app.use("/api/graph", graphRoutes);


app.use(errorHandler)

module.exports = app