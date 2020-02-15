const express = require("express");
const mysql = require("mysql");
const PORT = 8080;
const DATABASENAME = "webshop";
const path = require("path");

process.on("uncaughtException", function(err) {
  console.error(err);
});

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  multipleStatements: true
});

var mockDataSqlCommand = `
CREATE DATABASE IF NOT EXISTS ${DATABASENAME};

USE ${DATABASENAME};

CREATE TABLE IF NOT EXISTS products(id int, title VARCHAR(255), info VARCHAR(255), price DECIMAL(10, 2), img VARCHAR(255), company VARCHAR(255), PRIMARY KEY (id));
REPLACE INTO products (id, title, info, price, img, company)
VALUES
(1, 'iPhone 7', 'Brand new iPhone 7', 399.99, 'images/iphone7.png', 'Apple'),
(2, 'Macbook Pro', 'Brand new Macbook Pro', 999.99, 'images/macbook_pro.png', 'Apple'),
(3, 'Dell Laptop', 'Brand new Dell Laptop', 349.99, 'images/dell_laptop.png', 'Dell'),
(4, 'iMac', 'Brand new iMac', 1299.99, 'images/imac.png', 'Apple'),
(5, 'Xbox One', 'Brand new Xbox One', 399.99, 'images/xbox_one.png', 'Microsoft'),
(6, 'Playstation 4', 'Brand new PS4', 399.99, 'images/playstation4.png', 'Sony'),
(7, 'Nintendo Switch', 'Brand new Nintendo Switch', 299.99, 'images/nintendo_switch.png', 'Nintendo');
`;

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("Connection successful.");
});
db.query(mockDataSqlCommand, function(err, result) {
  if (err) throw err;
  console.log("Database created successfully.");
});

const app = express();

// Get all products
app.get("/products", (req, res) => {
  let sql = "SELECT * FROM products";
  let query = db.query(sql, (err, results) => {
    if (err) console.error(err);
    else res.send(JSON.stringify(results));
  });
});

// Get product image file
app.get("/products/:id/file", (req, res) => {
  let sql = `SELECT * FROM products WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(404).send("Not found");
    } else res.sendFile(path.resolve(__dirname, `${results[0].img}`));
  });
});

app.listen(PORT, () => {
  console.log("Server started on port 8080");
});
