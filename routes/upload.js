var express = require('express');
var multer = require('multer');
var fs = require('fs');
var router = express.Router();

var storage = multer.diskStorage({
  destination: 'public/i',
  filename: function (req, file, cb) {
    console.log(file);
    if(!fs.existsSync('public/i/' + file.originalname)) {
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

var upload = multer({ dest: 'public/i/', storage: storage, fileFilter: fileFilter});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'hasthe.moe', posted: false});
});
router.post('/', function(req, res, next) {
  upload.single('file')(req, res, function(err) {
    if(typeof req.file == 'undefined') {
      // no file was given
      res.json({status:false, reason: 'No file'});
      return;
    }
    if(!err) {
      res.json({reason:'', status:true, link:'/i/' + req.file.filename});
      return;
    }
    if(err instanceof multer.MulterError) {
      throw new Error(err.message);
    } else {
      // is it safe to assume this is always the bad file type error?
      if(err.message == "Only png, jpeg and gif images are allowed") {
        res.json({reason:'Invalid file type', status:false})
        return;
      } else {
        throw new Error(err.message);
      }
    }
  });

});

module.exports = router;
