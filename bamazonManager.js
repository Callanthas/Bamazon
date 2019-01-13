var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "demonR3@lm",
    database: "Bamazon"
});

connection.connect();
start()
function start() {
  inquirer.prompt([
    {
      message: "What would you like to do?",
      type: "list",
      name: "managerAction",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"]
    }
  ]).then(function (ans) {
    switch (ans.managerAction) {
        case "View Products for Sale":
        viewProducts()
        break;
        case "View Low Inventory":
        viewLowInventory()
        break;
        case "Add to Inventory":
        addInventory()
        break;
        case "Add New Product":
        addProduct()
        break;
        case "End Session":
        connection.end()
    }
  });
}

function viewProducts () {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
}

function viewLowInventory() {
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
}

function addInventory() {
  connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;
    
    inquirer.prompt([
      {
        message: "Please type the Product ID: ",
        name: "prodId",
        type: "input"
      },
      {
        message: "How many would you like to add?",
        name: "prodQty",
        type: "input"
      }
    ]).then(function (ans) {
      connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        var prod;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id == ans.prodId) {
            prod = res[i]
          }
        }
        console.log("Inventory added correctly.");
        if (prod !== undefined) {
          addToInventory(prod, ans.prodId, parseInt(ans.prodQty))
          start();
        } else {
          console.log("That item doesn't exist!")
          start();
        }
      })
    })
  })
};

function addToInventory(prodObj, prodId, prodQty) {
  var newQuantity = prodObj.stock_quantity + prodQty
  var query = "UPDATE products Set stock_quantity = ? WHERE ?";
  connection.query(query, [newQuantity, { item_id: prodId }], function (err, res) {
  })
}

function addProduct() {
  inquirer.prompt([
        {
        message: "What is the name of this product?",
        type: "input",
        name: "name"
        },
        {
        message: "What department does this product belong to?",
        type: "input",
        name: "department"
        },
        {
        message: "What is the price of this product?",
        type: "input",
        name: "price"
        },
        {
        message: "How many are in stock?",
        type: "input",
        name: "stock"
        }
  ]).then(function (ans) {
    connection.query("INSERT INTO products SET ?", {
        product_name: ans.name,
        department_name: ans.department,
        price: ans.price,
        stock_quantity: ans.stock
    }),
    console.log("Product succesfully added!");
    start();
  })
}
