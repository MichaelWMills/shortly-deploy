var mongoose = require('mongoose');

mongoURI = 'mongodb://localhost/shortlydb';
mongoose.connect(mongoURI);

// Run in separate terminal window using 'mongod'
var db = mongoose.connection;

//Handles errors with creating a connection to the DB
db.on('error', console.error.bind(console, 'connection error:'));

//Notification that a connection was successfully created.
db.once('open', function () {
  console.log('Mongodb connection open');
});

module.exports = db;
