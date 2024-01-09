import multer from "multer";
import path from "path";

const limits = {
  fileSize: 1024 * 1024 * 5, // 5 MB (adjust the limit as needed)
};

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded files
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    // Set the file name
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "-" +
        (Math.floor(Math.random() * 100) + 1) +
        path.extname(file.originalname)
    );
  },
});

const multerUpload = multer({ storage: storage, limits: limits });

export default multerUpload;
