const postgres_details = require('../config.js')
const sql_query = require('../sql');

const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authMiddleware = require('./middleware');
const antiMiddleware = require('./antimiddle');

// Postgre SQL Connection
const { Pool } = require('pg');
const pool = new Pool({
  user: postgres_details.user,
  host: postgres_details.host,
  database: postgres_details.database,
  password: postgres_details.password,
  port: postgres_details.port,
  connectionString: process.env.DATABASE_URL,
  //ssl: true
});

function findUser (username, callback) {
	pool.query(sql_query.query.get_user, [username], (err, data) => {
		if(err) {
			console.error("Cannot find user");
			return callback(null);
		}
		
		if(data.rows.length == 0) {
			console.error("User does not exists?");
			return callback(null)
		} else if(data.rows.length == 1) {
			return callback(null, {
				username    : data.rows[0].username,
        passwordHash: data.rows[0].password,
			});
		} else {
			console.error("More than one user?");
			return callback(null);
		}
	});
}

function findAdmin (username, callback) {
	pool.query(sql_query.query.get_admin, [username], (err, data) => {
    console.log('fromsql_query: ', username, data)
		if(err) {
			console.error("Cannot find user");
			return callback(null);
		}
		
		if(data.rows.length == 0) {
			console.error("Admin does not exists?");
			return callback(null)
		} else if(data.rows.length == 1) {
			return callback(null, {
				admin_username    : data.rows[0].admin_id,
        passwordHash      : data.rows[0].password,
			});
		} else {
			console.error("More than one admin?");
			return callback(null);
		}
	});
}

passport.serializeUser(function (user, callback ) {
  console.log('serialise', user);
  if(user.username) {
    callback(null, {
     id: user.username,
     type: 'user'
    });
  } else {
    callback(null, {
      id: user.admin_username,
      type: 'admin'
    });
  }
  // callback(null, user.username);
})

passport.deserializeUser(function (user, callback) {
  console.log('deserialise', user)
  if (user.type =='user') {
    findUser(user.id, callback);
  } else if (user.type == 'admin') {
    findAdmin(user.id, callback);
  } else {
    console.error("No such type of user");
  }
})

function initPassport () {
  passport.use('user',new LocalStrategy(
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err);
        }

        // User not found
        if (!user) {
          console.error('User not found');
          return done(null, false);
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err);
          }
          if (!isValid) {
            return done(null, false);
          }
          return done(null, user);
        })
      })
    }
  )); 

  passport.use('admin', new LocalStrategy(
    (admin_username, password, done) => {
      console.log('in localstrategy: ', admin_username)
      findAdmin(admin_username, (err, admin) => {
        console.log('in callback ', admin, admin_username, password)
        if (err) {
          console.err(err);
          return done(err);
        }

        // User not found
        if (!admin) {
          console.error('Admin not found');
          return done(null, false);
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, admin.passwordHash, (err, isValid) => {
          if (err) {
            console.err(err);
            return done(err);
          }
          if (!isValid) {
            return done(null, false);
          }
          return done(null, admin);
        })
      })
    }
  ));

  passport.authMiddleware = authMiddleware;
  passport.antiMiddleware = antiMiddleware;
  passport.findUser = findUser;
  passport.findAdmin = findAdmin;
  
}

module.exports = initPassport;
