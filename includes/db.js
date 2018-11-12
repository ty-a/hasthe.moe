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

    loginUser: function(username, password, done) {
      db.get('SELECT userName, userPassword, userId FROM users WHERE userName = ?', username, function(err, row) {
          if(err) {
            console.error(err);
            return done(null, false);
          }

          if(row == null) {
            return done(null, false);
          }

          bcrypt.compare(password, row.userPassword, function(err, res) {
            console.log(password, row.userPassword);
            if(res) { // match
              return done(null, {username: username, userId: row.userId});
            } else {
              return done(null, false);
            }
          });

      });
      return false;
    },

    createUser: function(username, password) {
      db.get('SELECT userName FROM users WHERE userName = ?', username, function(err, row) {
        if(!row) {
          // user does not exist so continue
          bcrypt.genSalt(12, function(err, hash) {
            if(err) {
              console.error(err);
              return false;
            }
            bcrypt.hash(password, hash, null, function(err, res) {
              if(err) {
                console.log('error hashing password');
                console.error(err);
              }
              db.run('INSERT INTO users(userName, userPassword) VALUES(?,?)',
                username,
                res,
                function(err, row) {
                  if(err) {
                    console.error(err);
                  }
                }
              );
            });
          } );
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
