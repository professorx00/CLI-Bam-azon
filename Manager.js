const Table = require('cli-table');
const mysql = require('mysql');
const inquirer = require('inquirer');

// instantiate table
const table = new Table({
    head: ['Product ID', 'Product Name', 'Price', 'In Stock','Department Number']
    , colWidths: [20, 60, 20, 20, 20]
});
//intialize Database
var database = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});
//create and show Logo
var logoCli = require('cli-logo'),
    version = 'v' + require('./package.json').version,
    description = require('./package.json').description;
    logoConfig = {
        "name": "BAMAZON",
        "description": description,
        "version": version
    };
 
logoCli.print(logoConfig);
//connect to Database and Start the program
database.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + database.threadId);
    createTable();
});
//display Table
function printTable() { console.log(table.toString()); }
//Display Low Inventory of less then 10
function lowInventory(){
    const lowInventoryTable = new Table({
        head: ['Product ID', 'Product Name', 'Price', 'In Stock','Department Number']
        , colWidths: [20, 60, 20, 20, 20]
    });
    database.query("select * from products where stock_quantity<=10", (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            let temp = []
            temp.push(element.item_id, element.product_name, element.price, element.stock_quantity,element.dept_ID);
            lowInventoryTable.push(temp)
        });
        console.log(lowInventoryTable.toString());
        askManager();
    })
}
//Allows user to add to inventory
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
//Allows user to add New Product
function addNewProduct(){
    inquirer.prompt([
        {
            name:"product",
            message:"What is the new Item",
            type:"input"
        },
        {
            name:"department",
            message:"What department number does the new item belong too?",
            type:"number",
            validate:function(value){
                if(isNaN(value)){
                    return false
                }
                else{
                    return true
                }
            }
        },
        {
            name:"price",
            message:"How much will it cost?",
            type:"number",
            validate:function(value){
                if(isNaN(value)){
                    return false
                }
                else{
                    return true
                }
            }
        },
        {
            name:"amount",
            message:"How many do we have in inventory?",
            type:"number",
            validate:function(value){
                if(isNaN(value)){
                    return false
                }
                else{
                    return true
                }
            }
        }
    ]).then((answers)=>{
        let product = answers.product;
        let dept = answers.department;
        let price = answers.price;
        let amount = answers.amount;
        let queryInfo = [product,price,amount,dept]
        
        database.query("insert into products(product_name,price,stock_quantity,dept_id) values(?,?,?,?)",queryInfo,(err,res)=>{
            if(err) throw err;
            if(res){console.log(`${product} has been added into the database`)}
            database.query("select item_id from products where product_name=?",[product],function(err,res){
                if(err) throw err;
                queryInfo.splice(0,0,res[0].item_id);
                table.push(queryInfo);
                setTimeout(()=>{askManager()},1000);
            })
        }); 
    });
}
//Ask User what they want to do
function askManager(){
    
    inquirer.prompt([
        {
            name:"selection",
            message:"Please choose which option you need",
            type: "list",
            choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit"]
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
            case "Exit":
                process.exit();
            default:
                console.log("Something went wrong. Please try again")
                askManager();
                break;
        }
    });
}
//Starts the system
function createTable() {
    database.query("select * from products", (err, res) => {
        if (err) throw err;
        res.forEach(element => {
            let temp = []
            temp.push(element.item_id, element.product_name, element.price, element.stock_quantity,element.dept_ID);
            table.push(temp)
        });
        printTable();
        askManager()
    })
}
