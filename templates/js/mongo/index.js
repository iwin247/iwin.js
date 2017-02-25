var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

exports.connect = (name)=>{
 return mongoose.connect('mongodb://localhost/'+name);
}

var UsersSchema = mongoose.Schema({
  id: {type: String},
  passwd: {type: String},
  name: {type: String},
  token: {type: String},
  setting: {type: String},
  profile: {type: String},
  profile_img: {type: String},
  facebook_id: {type: String},
  github_id: {type: String},
  twitter_id: {type: String},
});

exports.Users = mongoose.model("users", UsersSchema);
exports.db = db;
