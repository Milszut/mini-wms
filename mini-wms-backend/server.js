require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const csrf = require('./middleware/csrf');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const itemsRoutes = require('./routes/items');
const locationRoutes = require('./routes/location');
const serviceRoutes = require('./routes/service');
const statusRoutes = require('./routes/status');
const conditionRoutes = require('./routes/condition');
const statsRoutes = require('./routes/stats');
const resetRoutes = require("./routes/reset");
const cron = require("node-cron");
const resetDatabase = require("./resetDatabase");

const app = express();

const WEB_ORIGIN = process.env.WEB_ORIGIN;
const PORT = process.env.PORT || 4000;


app.use(helmet({crossOriginResourcePolicy: { policy: "cross-origin" }}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: WEB_ORIGIN,credentials: true,}));
app.use(rateLimit({ windowMs: 60_000, max: 5000 }));

app.use('/items', itemsRoutes);
app.use('/auth', authRoutes);
app.use(csrf);
app.use('/user', userRoutes);
app.use('/location', locationRoutes);
app.use('/service', serviceRoutes);
app.use('/status', statusRoutes);
app.use('/condition', conditionRoutes);
app.use('/stats', statsRoutes);
app.use("/reset", resetRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

cron.schedule("0 0 * * *", async () => {
  console.log("Resetting demo data...");

  try {
    await resetDatabase();
    console.log("Database reset completed.");
  } catch (err) {
    console.error("Database reset failed:", err);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});