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

function printTable() { console.log(table.toString()); }

function lowInventory(){
    const lowInventoryTable = new Table({
        head: ['Product ID', 'Product Name', 'Department', 'Price', 'In Stock']
        , colWidths: [20, 20, 20, 20, 20]
    });
    database.query("select * from products where stock_quantity<=10", (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            let temp = []
            temp.push(element.item_id, element.product_name, element.department_name, element.price, element.stock_quantity);
            lowInventoryTable.push(temp)
        });
        console.log(lowInventoryTable.toString());
        askManager();
    })
}

function addInventory(){
    inquirer.prompt([
        {
            name:"product",
            message:"which product Id do you want to add too?",
            type:"number"
        },
        {
            name:"amount",
            message:"How much do you want to add?",
            type:"number"
        }
    ]).then((answer)=>{
        let product = answer.product;
        let amount = parseInt(answer.amount);
        database.query(`select * from products where item_id=${product}`,(err,res)=>{
            if(err) throw err;
            let itemInfo = res[0];
            let newAmount = amount+parseInt(itemInfo.stock_quantity)
            database.query(`update products set stock_quantity=${newAmount} where item_id=${product}`,(err,res)=>{
                if(err) throw err;
                if(res){console.log(`You have added ${amount} to ${itemInfo.product_name} successfully.New total is ${newAmount}`)}
            });
            setTimeout(()=>{askManager()},1000);
        });
        
    })
}

function addNewProduct(){
    inquirer.prompt([
        {
            name:"product",
            message:"What is the new Item",
            type:"input"
        },
        {
            name:"department",
            message:"What department is the new Item?",
            type:"input"
        },
        {
            name:"price",
            message:"How much will it cost?",
            type:"number"
        },
        {
            name:"amount",
            message:"How many do we have in inventory?",
            type:"number"
        }
    ]).then((answers)=>{
        let product = answers.product;
        let dept = answers.department;
        let price = answers.price;
        let amount = answers.amount;
        let queryInfo = [product,dept,price,amount]
        database.query("insert into products(product_name,department_name,price,stock_quantity) values(?,?,?,?)",queryInfo,(err,res)=>{
            if(err) throw err;
            if(res){console.log(`${product} has been added into the database`)}
        });
        setTimeout(()=>{askManager()},1000);
    });
}

function askManager(){
    
    inquirer.prompt([
        {
            name:"selection",
            message:"Please choose which option you need",
            type: "list",
            choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
        }
    ]).then((answer)=>{
        let choice = answer.selection
        switch(choice){
            case "View Products for Sale":
                printTable();
                askManager();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            default:
                console.log("Something went wrong. Please try again")
                askManager();
                break;
        }
    });
}

function createTable() {
    database.query("select * from products", (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            let temp = []
            temp.push(element.item_id, element.product_name, element.department_name, element.price, element.stock_quantity);
            table.push(temp)
        });
        printTable();
        askManager()
    })
}

function start() {
    createTable()
    
}