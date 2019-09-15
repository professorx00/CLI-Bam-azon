const Table = require('cli-table');
const mysql = require('mysql');
const inquirer = require('inquirer');

// instantiate
const table = new Table({
    head: ['Product ID', 'Product Name', 'Department', 'Price', 'In Stock']
    , colWidths: [20, 20, 20, 20, 20]
});

var database = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});
database.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + database.threadId);
    start();
});
// table.push([14,"Test Product","Test Department",14.99,45])

function printTable() { console.log(table.toString()); }

function createTable() {
    database.query("select * from products", (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            let temp = []
            temp.push(element.item_id, element.product_name, element.department_name, element.price, element.stock_quantity);
            table.push(temp)
        });
        askCustomer();
    })
}


function askCustomer() {
    printTable();
    inquirer.prompt([{
        name: "product",
        message: "What product ID would you like to purchase?",
        type: "input"
    }, {
        name: "amount",
        message: "How many Units would you like to purchase?",
        type: "number"
    }]).then((answers) => {
        let product = answers.product;
        let amount = answers.amount;
        database.query("select product_name,price,stock_quantity from products where item_id=?", [product], (err, res) => {
            if (err) throw err;
            let price = parseFloat(res[0].price);
            let product_name = res[0].product_name;
            let removeAmount = parseInt(res[0].stock_quantity) - parseInt(amount);
            if(removeAmount>0){
                database.query(`update products set stock_quantity=${removeAmount} where item_id=${product}`, (err, res) => {
                    if (err) throw err
                    console.log(price)
                    let total = parseInt(amount) * price
                    console.log(`You Purchased ${amount} of ${product_name} for a total of ${total}`)
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