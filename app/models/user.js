var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


//Defines the property names and value types of those properties of the schema, with options.
var userSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type : String, required: true }
});

//Initializes the User schema.
var User = mongoose.model('User', userSchema);

//Method used to compare the password given by the user and the password on file in the database.
User.comparePassword = function(canidatePassword, savedPassword, cb){
  //bcrypt is the module that manages passwords. .compare returns true or false depending on if the password entered is a match for the username the user is attempting to log into.
  bcrypt.compare(canidatePassword, savedPassword, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

//Saves a hashed password to the database...
userSchema.pre('save', function(next) {
  //cipher is an asynchronous function invocation of the bcrypt hash method, promisified so that it is executed in proper order.
  var cipher = Promise.promisify(bcrypt.hash);
  //Adds the hashed password to the current username in question (at 'this').
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

module.exports = User;
