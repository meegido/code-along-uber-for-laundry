const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = (mongooseConnection) => (
  session({
    secret: 'never do your own laundry again', //
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection })
  })
);
