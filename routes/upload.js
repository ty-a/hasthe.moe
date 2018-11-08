var express = require('express');
var multer = require('multer');
var fs = require('fs');
var router = express.Router();
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var config = require('../config/config.json');
function generateFileName() {
    var out = "";
    for(i = 0; i < 8; i++) {
      out += letters.charAt(Math.random() * letters.length)
    }

    return out;


}

var storage = multer.diskStorage({
  destination: 'public/i',
  filename: function (req, file, cb) {
    console.log(file);
    var ext = file.originalname.split(".").pop();
    var name = generateFileName() + '.' + ext;
    while(true) {
      if(!fs.existsSync('public/i/' + '.' + name)) {
        break;
      } else {
        name = generateFileName() + '.' + ext;
      }
    }
    cb(null, name)
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
  res.render('upload', { title: 'hasthe.moe', posted: false, enabled: config.enableuploadform});
});

router.post('/2', function(req, res, next) {
  upload.single('file')(req, res, function(err) {

    if(req.body.secretkey != config.secretkey) {
      res.json({status:false, reason:'Invalid secret key'});
      return;
    }

    if(typeof req.file == 'undefined') {
      // no file was given
      res.json({status:false, reason: 'No file'});
      return;
    }
    if(!err) {
      res.send(config.site + '/i/' + req.file.filename);
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
router.post('/', function(req, res, next) {
  if(!config.enableuploadform) {
    res.json({status:false, reason:"The upload form is disabled."});
    return;
  }
  upload.single('file')(req, res, function(err) {
    if(typeof req.file == 'undefined') {
      // no file was given
      res.json({status:false, reason: 'No file'});
      return;
    }
    if(!err) {
      res.json({reason:'', status:true, link:config.site + '/i/' + req.file.filename});
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
