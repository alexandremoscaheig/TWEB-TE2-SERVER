const mongoose = require('mongoose');
const ResponseError = require('./ResponseError');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  followers: Array,
  followings: Array,
  posts: Array,
});
const User = mongoose.model('User', userSchema);

const postSchema = new Schema({
  url: String,
  title: String,
  description: String,
  comments: Array,
});
const Post = mongoose.model('Post', postSchema);

const commentSchema = new Schema({
  userid: Number,
  username: String,
  text: String,
});
const Comment = mongoose.model('Comment', commentSchema);


mongoose.connect('mongodb://githubheig:githubheig$2018@cluster0-shard-00-00-inrvv.mongodb.net:27017,cluster0-shard-00-01-inrvv.mongodb.net:27017,cluster0-shard-00-02-inrvv.mongodb.net:27017/y2u?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', { useNewUrlParser: true });

class DBUtils {
  static addUser(user) {
    const dbUser = new User({ ...user });
    return dbUser.save()
      .catch((err) => {
        throw new ResponseError({ status: 500, url: 'register' }, { message: err });
      });
  }

  static getUserById(id) {
    return User.findById(id, { password: 0 });
  }

  static getUserLogin(email, password) {
    return User.findOne({ email, password }, { password: 0 });
  }

  static findAllComments(req, res) {
    Comment.find({}, (err, comments) => {
      if (err) {
        res.send(err);
      }
      res.json(comments);
    });
  }

  static addNewComment(req, res) {
    const comment = new Comment({
      id: 1,
      userid: 1,
      username: 'alex',
      text: 'test',
    });
    comment.save();
  }
}


module.exports = DBUtils;
