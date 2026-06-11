const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("❌ Nieobsługiwany format pliku."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

async function verifyRealImage(req, res, next) {
  if (!req.file) return next();

  try {
    await sharp(req.file.path).metadata();
    next();
  } catch (err) {
    console.error("❌ Fałszywy lub uszkodzony plik udający obraz:", err);
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Plik nie jest prawidłowym obrazem!" });
  }
}

async function convertHeicToJpeg(req, res, next) {
  if (!req.file) return next();

  const ext = path.extname(req.file.path).toLowerCase();
  const isHeic = ext === ".heic" || req.file.mimetype === "image/heic";

  if (!isHeic) return next();

  try {
    const outputPath = req.file.path.replace(ext, ".jpg");

    await sharp(req.file.path).jpeg({ quality: 90 }).toFile(outputPath);
    fs.unlinkSync(req.file.path);

    req.file.filename = path.basename(outputPath);
    req.file.path = outputPath;
    req.file.mimetype = "image/jpeg";

    next();
  } catch (err) {
    console.error("❌ Błąd konwersji HEIC → JPG:", err);
    return res.status(500).json({ error: "Błąd konwersji zdjęcia!" });
  }
}

module.exports = { upload, verifyRealImage, convertHeicToJpeg };