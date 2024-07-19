const multer = require("multer");
const path = require("path");
const fs = require("fs");

const folderMap = {
  profiles: "public/profiles",
  products: "public/products",
  documents: "public/documents",
  misc: "public/misc",
};

// where to store the files
const storage = multer.diskStorage({
  // reference to directory where to store the files
  destination: function (req, file, cb) {
    const folder = folderMap[req.body.fileType] || folderMap["misc"];
    const fullPath = path.join(__dirname, folder);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },

  // reference to final name of the file
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploader = multer({ storage });

module.exports = uploader;
