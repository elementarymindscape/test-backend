const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(
  'mongodb+srv://herumbn25:herumb25@cluster0.uuwlv.mongodb.net/test'
);

const UserModel = require('./Models/Users');

const Login = mongoose.model(
  'login',
  new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    { collection: 'login' }
  )
);

app.get('/users', async (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }

    res.send(result);
  });
});

app.delete('/users', async (req, res) => {
  let id = req.body.id;
  UserModel.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send({ result: result, message: 'User Deleted Succesfully!!' });
  });
});

app.post('/login', async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    let user = await Login.findOne({ email: email });
    if (!user) return res.send({ message: 'User Not Found!' });
    let isMatch = password == user.password ? true : false;
    if (!isMatch) return res.send({ message: 'Invalid Password!' });
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      'secretKeyToBeAddedHere',
      { expiresIn: 300 }
    );
    res.send({ token: token, email: user.email, id: user._id });
  } catch (err) {
    res.status(400).json({ message: 'Something Went Wrong!' });
  }
});

app.post('/users', async (req, res) => {
  const userName = req.body.username;
  const phone = req.body.phone;
  const email = req.body.email;
  const address = req.body.address;

  UserModel.insertMany(
    {
      username: userName,
      phone: phone,
      email: email,
      address: address,
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send({ result: result, message: 'User Added Succesfully!!' });
    }
  );
});

app.get('/', (req, res) => {
  res.send('Running backend services');
});

app.listen(3001, () => {
  console.log('Server Running on port 3001...');
});
