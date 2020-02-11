const express = require("express");
const mysql = require("mysql");
const PORT = 8080;
const DATABASENAME = "webshop";

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  multipleStatements: true
});

var mockDataSqlCommand = `
CREATE DATABASE IF NOT EXISTS ${DATABASENAME};

USE ${DATABASENAME};

CREATE TABLE IF NOT EXISTS products(id int AUTO_INCREMENT, title VARCHAR(255), info VARCHAR(255), price DECIMAL(10, 2), img VARCHAR(255), company VARCHAR(255), PRIMARY KEY (id));
INSERT INTO products (title, info, price, img, company)
VALUES 
('iPhone 7', 'Brand new iPhone 7', 399.99, 'images/iphone7.png', 'Apple'),
('Macbook Pro', 'Brand new Macbook Pro', 999.99, 'images/macbook_pro.png', 'Apple'),
('Dell Laptop', 'Brand new Dell Laptop', 349.99, 'images/dell_laptop.png', 'Dell'),
('iMac', 'Brand new iMac', 1299.99, 'images/imac.png', 'Apple'),
('Xbox One', 'Brand new Xbox One', 399.99, 'images/xbox_one.png', 'Microsoft'),
('Playstation 4', 'Brand new PS4', 399.99, 'images/playstation4.png', 'Sony'),
('Nintendo Switch', 'Brand new Nintendo Switch', 299.99, 'images/nintendo_switch.png', 'Nintendo');
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

app.get("/products", (req, res) => {
  let sql = "SELECT * FROM products";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(JSON.stringify(results));
  });
});

app.listen(PORT, () => {
  console.log("Server started on port 8080");
});
