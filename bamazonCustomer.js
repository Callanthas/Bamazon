var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "demonR3@lm",
    database: "Bamazon"
});

connection.connect();
start();

/*connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("Here is a list of all the items for sale:");
    console.table(res);
     for (var i = 0; i < res.length; i++) {
        console.log("Item " + res[i].item_id + ": " + res[i].product_name);
        console.log("Price: $" + res[i].price);
    } 
});*/

function start() {
    inquirer.prompt([
        {
          message: "What would you like to do?",
          type: "list",
          name: "customerAction",
          choices: ["View Products for Sale", "Buy a Product", "End Session"]
        }
    ]).then(function (ans) {
        switch (ans.customerAction) {
            case "View Products for Sale":
            viewProducts()
            break;
            case "Buy a Product":
            buyProducts()
            break;
            case "End Session":
            connection.end()
            }   
        });
    };

function viewProducts () {
    connection.query("SELECT * FROM products", function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
    })
}

function buyProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        inquirer.prompt([
        {
            message: "Please type the product ID: ",
            name: "prodId",
            type: "input",
        }, 
        {   
            message: "How many units of this item would you like to buy?",
            name: "prodQty",
            type: "input"
        }
    ]).then(function(ans) {
        connection.query('SELECT * FROM products', function (err, res) {
            if (err) throw err;
            var prod;
            for (var i = 0; i < res.length; i++) {
              if (res[i].item_id == ans.prodId) {
                prod = res[i]
              }
            }

            if (prod.stock_quantity >= parseInt(ans.prodQty)) {
                var newQty = prod.stock_quantity - (parseInt(ans.prodQty));
                var sales = (parseInt(ans.prodQty) * prod.price);
                connection.query('UPDATE products SET ? WHERE ?', [{
                        stock_quantity: newQty
                    }, {
                        item_id: prod.item_id
                    }], function(error) {
                        if (error) throw err;
                        console.log("Order successful!");
                        console.log("Total cost: " + sales);
                        start();
                    }
                );
                connection.query('UPDATE products SET product_sales = ? WHERE ?', [sales, { item_id: prod.item_id }], function (error, res) {
                })
            } else if (prod.stock_quantity <= 0) {
                    console.log("Sorry, item is out of stock!");
                    start();
            } else {
                console.log("There's not enough left in stock. Try again...");
                start();
                };
            });
        });
    });
};