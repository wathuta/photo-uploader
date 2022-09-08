const express = require("express");
const ejs = require("ejs");
const path = require("path");
const multer = require("multer");

//Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("myImage");

const checkFileType = (file, cb) => {
  //Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  //check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  //check mime
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error : Images Only!");
  }
};

//init app with express
const app = express();
//set up ejs
app.set("view engine", "ejs");

//public folder
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(req.file);
      res.render("index", { msg: err });
    } else {
      if (req.file === undefined) {
        res.render("index", {
          msg: "Error: No file Selected",
        });
      } else {
        res.render("index", {
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`server listening on http://localhost:${PORT}`)
);
