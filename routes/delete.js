var fs = require('fs');

module.exports = function(passport, dbFunctions, config) {
  var express = require('express');
  var router = express.Router();

  router.post('/file/:file', function(req, res, next) {
    if(req.body.secretkey != config.secretkey && !req.isAuthenticated()) {
      res.json({"status": false, "reason": "Not logged in"});
      return;
    }

    fs.unlink("public/i/" + req.params.file, function(err) {
      if(err) {
        if(process.env.ENV == 'dev') {
          res.json({"status": false, "reason": err.toString()});
        } else {
          res.json({"status": false, "reason": "File doesn't exist"});
        }
      } else {
        res.json({"status": true, "reason":""});
      }
    });



  });

  return router;
}
