const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// const ALL_USERS = [
//   {
//     username: "harkirat@gmail.com",
//     password: "123",
//     name: "harkirat singh",
//   },
//   {
//     username: "raman@gmail.com",
//     password: "123321",
//     name: "Raman singh",
//   },
//   {
//     username: "priya@gmail.com",
//     password: "123321",
//     name: "Priya kumari",
//   },
// ];

//your mongo url+/db name
mongoose.connect("mongodb://localhost:27017/LoginPageNodeExpress");
const forPractice = mongoose.model("practice", {
  name: String,
  rollNumber: String,
});
const result = new forPractice({ name: "nomita", rollNumber: "7" });
result.save();

// const ALL_USERS = mongoose.model("Users", {
//   name: String,
//   username: String,
//   password: String,
// });
//
//

function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in ALL_USERS array
  let User_Exist = false;
  for (let i = 0; i < ALL_USERS.length; i++) {
    if (
      ALL_USERS[i].username == username &&
      ALL_USERS[i].password == password
    ) {
      User_Exist = true;
    }
  }
  return User_Exist;
}

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  //console.log(token);
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const currentUsername = decoded.username;
    // return a list of users other than this username
    res.json({
      users: ALL_USERS.filter(function (value) {
        if (value.username == currentUsername) {
          return false;
        } else {
          return true;
        }
      }),
    });
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000, function () {
  //it will show in terminal console
  console.log(`Example app listening on port 3000`);
});
