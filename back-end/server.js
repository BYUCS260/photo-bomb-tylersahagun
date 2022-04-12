const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// setup express
const app = express();

// setup body parser middleware to conver to JSON and handle URL encoded forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// connect to the mongodb database
mongoose.connect('mongodb://localhost:27017/photobomb', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  },
  desc: String,
  id: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Comment = mongoose.model('Comment', commentSchema);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// import the users module and setup its API path
const users = require("./users.js");
app.use("/api/users", users.routes);
const User = users.model;
const validUser = users.valid;

const photos = require("./photos.js");
app.use("/api/photos", photos.routes);

app.post('/api/comments', validUser, async (req,res) => {      
  const comment = new Comment({
    desc: req.body.desc, 
    id: req.body.id,
    user: req.user,
  });
  try {
    await comment.save();
    res.send(comment);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

// Get a list of all of the comments.
app.get('/api/comments/:id', async (req, res) => {
  try {
    let comments = await Comment.find({
      id: req.params.id,
    }).sort({
      created: -1
    }).populate('user');
    return res.send(comments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3001, () => console.log('Server listening on port 3001!'));