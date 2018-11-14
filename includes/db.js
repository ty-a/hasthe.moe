var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(db) {
  var out = {
    getUserFromId: function(userId, done) {
      db.get('SELECT userId, userName FROM users WHERE userId = ?', userId, function(err, row) {
        if(!row) {
          // userid does not exist
          return done(null, false);
        }
        return done(null, row);
      });
    },

    loginUser: function(req, username, password, done) {
      db.get('SELECT userName, userPassword, userId FROM users WHERE userName = ?', username, function(err, row) {
          if(err) {
            console.error(err);
            return done(null, false, {message:"Database error"});
          }

          if(row == null) {
            return done(null, false, {message:"User account doesn't exist."});
          }

          bcrypt.compare(password, row.userPassword, function(err, res) {
            if(res) { // match
              return done(null, {username: username, userId: row.userId});
            } else {
              return done(null, false, {message:"Invalid password"});
            }
          });

      });
      return false;
    },

    createUser: function(req, username, password, callback) {
      db.get('SELECT userName FROM users WHERE userName = ?', username, function(err, row) {
        if(!row) {
          bcrypt.genSalt(12, function(err, hash) {
            if(err) {
              console.error(err);
              callback(false,'System error 1' );
              return false;
            }
            bcrypt.hash(password, hash, null, function(err, res) {
              if(err) {
                console.error(err);
                callback(false, 'System error 2');
                return false;
              }
              db.run('INSERT INTO users(userName, userPassword) VALUES(?,?)',
                [username, res], // the hash
                function(err) {;
                  if(err) {
                    console.error(err);
                    callback(false, 'System error 3');
                    return false;
                  }
                  callback(true, 'I set the message in the template');
                  return true;
                }
              );
            });
          } );
        } else {
          callback(false, 'User account already exists');
          return false;
        }
      });
    },

    createDB: function() {
      var query = fs.readFileSync('./sql/users.sql', {encoding: "UTF-8"}, function(err) {
        if(err) {
          console.log('Unable to read sql file.');
          console.error(err);
          return false;
        }
      });
      db.run(query);
    }
  };

  return out;
}
