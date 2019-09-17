const Table = require('cli-table');
const mysql = require('mysql');
const inquirer = require('inquirer');

// instantiate
const table = new Table({
    head: ['Product ID', 'Product Name','Price', 'In Stock','Department Number']
    , colWidths: [20, 40, 20, 20, 20]
});

var database = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});
var logoCli = require('cli-logo'),
    version = 'v' + require('./package.json').version,
    description = require('./package.json').description;
    logoConfig = {
        "name": "BAMAZON",
        "description": description,
        "version": version
    };
 
logoCli.print(logoConfig);

database.connect(function (err) {
    if (err) throw err;
    start();
});
// table.push([14,"Test Product","Test Department",14.99,45])

function printTable() { console.log(table.toString()); }

function createTable() {
    database.query("select * from products", (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            let temp = []
            temp.push(element.item_id, element.product_name, element.price, element.stock_quantity, element.dept_ID);
            table.push(temp)
        });
        askCustomer();
    })
}


function askCustomer() {
    printTable();
    inquirer.prompt([{
        name: "product",
        message: "What product ID would you like to purchase?('exit' to quit)",
        type: "input",
        validate:function(value){
            if(value.toLowerCase() === `exit`){
                process.exit();
            }
            else if (isNaN(value)){
                return false;
            }
            else{
                return true;
            }
        }
    }, {
        name: "amount",
        message: "How many Units would you like to purchase?",
        type: "number"
    }]).then((answers) => {
        let product = answers.product;
        let amount = answers.amount;
        database.query("select product_name,price,stock_quantity,product_sales from products where item_id=?", [product], (err, res) => {
            if (err) throw err;
            let price = parseFloat(res[0].price);
            let product_name = res[0].product_name;
            let removeAmount = parseInt(res[0].stock_quantity) - parseInt(amount);
            let currentSales = parseInt(res[0].product_sales || 0)
            let total = parseInt(amount) * price
            let NewSales = currentSales+total;
            if(removeAmount>0){
                database.query(`update products set stock_quantity=${removeAmount}, product_sales=${NewSales} where item_id=${product}`, (err, res) => {
                    if (err) throw err
                    console.log(`You Purchased ${amount} of ${product_name} for a total of ${total}\nProcessing...`)
                    setTimeout((ele)=>{
                        askCustomer();
                    },2000);
                });
            }else{
                console.log("Insufficent Inventory")
                setTimeout((ele)=>{
                    askCustomer();
                },2000);
                
            }

        })

    })
}

function start() {
    createTable()
}