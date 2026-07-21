import multer from "multer";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
   "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "video/mp4",
  "video/mov",
  "video/x-msvideo",
  "video/x-matroska",
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;