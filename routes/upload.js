var express = require('express');
var fs = require('fs');
var multer = require('multer');

var router = express.Router();

var storage = multer.diskStorage({
  destination: 'public/images',
  filename: function (req, file, cb) {
    console.log(file);
    if(!fs.existsSync('public/images/' + file.originalname)) {
      cb(null, file.originalname)
    } else {
      // file exists, so add a random number
      var name = file.originalname.split(".");
      var ext = name.pop();
      name = name.join('.');
      cb(null, name + '-' + Date.now() + '.' + ext)
    }
  }
});

var fileFilter = function(req, file, cb) {
  // ensure our files are a png, jpeg, or gif
  switch(file.mimetype) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
      cb(null, true);
      break;
    default:
      cb(new Error("Only png, jpeg and gif images are allowed"));
  }
}

var upload = multer({ dest: 'public/images/', storage: storage, fileFilter: fileFilter});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'hasthe.moe', posted: false});
});

router.post('/', upload.none(), function(req, res, next) {
  res.render('upload', { title: 'hasthe.moe', posted: true, status: false, reason:'No file provided.'});
});

router.post('/', function(req, res, next) {
  upload.single('file')(req, res, function(err) {
    if(!err) {
      res.render('upload', { title: 'hasthe.moe', posted: true, status:true, link:'https://hasthe.moe/' + req.file.destination + '/' + req.file.filename});
      return;
    }
    if(err instanceof multer.MulterError) {
      throw new Error(err.message);
    } else {
      // is it safe to assume this is always the bad file type error?
      if(err.message == "Only png, jpeg and gif images are allowed") {
        res.render('upload', {status: false, reason:"invalid file type", title:"Upload an image", posted: true});
        return;
      } else {
        throw new Error(err.message);
      }
    }
  });

});

module.exports = router;
