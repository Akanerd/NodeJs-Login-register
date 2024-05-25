const express = require("express");
const fs = require('fs');
const { binar } = require("./models/database.json");
const { log } = require("console");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: errorHandler
function errorHandler(err, req, res, next) {
  let messageReturn = "";
  let errorStatus;
  if (err.code === 400) {
    messageReturn = "Bad Request";
    errorStatus = 400;
  } else if (err.code === 404) {
    messageReturn = "Not found";
    errorStatus = 404;
  }
  res.render("errorpage", {
    messageReturn,
  });
}

app.get("/login", (req, res) => {
  res.render("loginpage");
});

app.get("/register", (req, res) => {
    res.render("registerpage");
  });

app.get("/list", (req, res) => {
  try {
    const data = binar;
    if (data) {
      return res.status(200).json({
        status: "Success",
        data: data,
      });
    } else {
      throw {
        code: 404,
      };
    }
  } catch (error) {
    throw {
      code: error.code,
      message: error.message,
    };
  }
});

app.post("/login", function (req, res) {
    fs.readFile('./models/database.json', 'utf8', (err, data) => {
        if (err) {
          console.error("Failed to read data:", err);
          res.status(500).send('Internal Server Error');
          return;
        }
        
        let result = JSON.parse(data);
        console.log(result.binar);
        const {username, pass} = req.body;
        console.log(username, pass);
        
        const user = result.binar.find(user => user.email === username && user.password === pass);
        
        if (user) {
          console.log('login berhasil');
          res.send("login berhasil");
        } else {
          res.status(401).send("Gagal login");
        }
      });
});

app.post("/register", function (req, res) {
    fs.readFile('./models/database.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Failed to read data:", err);
            res.status(500).send('Internal Server Error');
            return;
        }
        
        let result = JSON.parse(data);
        console.log(result.binar);
        const { username, pass } = req.body;
        console.log(username, pass);
   
        result.binar.push({ email: username, password: pass });
        
        fs.writeFile('./models/database.json', JSON.stringify(result), 'utf8', (err) => {
            if (err) {
                console.error("Failed to write data:", err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send("Registrasi berhasil");
            console.log('Registrasi berhasil');
        });
    });
});

// TODO: NOtfound Page
app.use(function (req, res) {
  res.render("notFound");
});

app.use(errorHandler);

// ! Server, wajib dijalankan !
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
