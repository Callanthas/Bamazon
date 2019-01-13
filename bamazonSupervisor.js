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

start();
function start(){
    inquirer.prompt([
        {
        message: "What would you like to do?",
        type: "list",
        name: "supervisorAction",
        choices: ["View Product Sales by Department", "Create New Department", "End Session"]
        }
    ]).then(function (ans) {
    switch (ans.supervisorAction) {
        case "View Product Sales by Department":
            viewSalesByDept()
            break;
        case "Create New Department":
            createNewDept()
            break;
        case "End Session":
            connection.end()
            break;
        }
    })
}

function viewSalesByDept () {
    connection.query("SELECT * FROM products p INNER JOIN departments d on p.department_name = d.department_name", function (err, res) {
        if (err) throw err;
        console.table(res);
        for (var i = 0; i < res.length; i ++){
            var totalProfit = res[i].product_sales - res[i].over_head_costs;
            console.log("| department_id | department_name | over_head_costs | product_sales | total_profit |");
            console.log("|              " + res[i].department_id + "| " + "  " + res[i].department_name + "   |" + "         " + res[i].over_head_costs + "    | " + "          " + res[i].product_sales + "| " + "         " + totalProfit + "|" )
        }
    start();
    });
} 
        
function createNewDept() {
  inquirer.prompt([
    {
      message: "Please type in the name of the department you would like to add.",
      type: "input",
      name: "deptName"
    },
    {
      message: "What is the overhead for this department?",
      type: "input",
      name: "overHeadCost"
    }
  ]).then(function (ans) {
    var query = "INSERT INTO departments (department_name, over_head_costs) VALUES(?, ?)"
    connection.query(query, [ans.deptName, parseInt(ans.overHeadCost)], function (err, res) {
      if (err) throw err;
      console.table(res);
      start()
    })
  })
}