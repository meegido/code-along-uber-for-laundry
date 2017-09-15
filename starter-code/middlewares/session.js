const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = (mongooseConnection) => (
  session({
    secret: 'never do your own laundry again', //process.env.SESSION_SECRET
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection })
  })
);
