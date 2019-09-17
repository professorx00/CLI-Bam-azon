const Table = require('cli-table');
const mysql = require('mysql');
const inquirer = require('inquirer');
//initalize Database
var database = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

//initalize and display logo
var logoCli = require('cli-logo'),
    version = 'v' + require('./package.json').version,
    description = require('./package.json').description;
    logoConfig = {
        "name": "BAMAZON",
        "description": description,
        "version": version
    };
 
logoCli.print(logoConfig);
//Connects and starts Application
database.connect(function (err) {
    if (err) throw err;
    start();
});
//initalize the table
let table = new Table({head: ['Department ID', 'Department Name', 'Over Head Cost', 'Product Sales', 'Profit'], colWidths: [20, 20, 20, 20, 20]});

//Displays Sales Data
function salesData() {
    totalSales=[]
    database.query("select department.dept_id,department.dept_name,department.over_head,case when isNull(sum(products.product_sales)) then 0 else sum(products.product_sales) end as sales from department left join products on department.dept_id = products.dept_ID group by department.dept_id",function(err,res){
        if(err) throw err;
        res.forEach(element => {
            let profit = (parseFloat(element.sales)-parseFloat(element.over_head)).toFixed(2);
            let temp = [element.dept_id,element.dept_name,element.over_head,element.sales,profit]
            table.push(temp)
        });
        console.log(table.toString());
        start();
    })
}

//Adds a Department
function addDepartment() {
    inquirer.prompt([
        {
            name:"name",
            message:"What is the new Department Name?",
            type:"input",
            validate:function(value){
                if(value==="" || value===" "){
                    return false;
                }
                else{
                    return true;
                }
            }
        },
        {
            name:"overHead",
            message:"What is the Over Head Cost for the Department?",
            type:"number",
            validate:function(value){
                if(isNaN(value)){
                    return false;
                }
                else{
                    return true;
                }
            }
        }
    ]).then((answers)=>{
        let name=answers.name;
        let overHead = parseFloat(answers.overHead);
        database.query("INSERT INTO department (dept_name,over_head) VALUES (?,?);",[name,overHead],(err,res)=>{
            if(err) throw err;
            if(res){console.log(`${name} has been added to the database.`)}
            start();
        })
    })
};


//Starts program
function start() {
    inquirer.prompt([
        {
            name: "choice",
            message: "Which do you want to do?",
            type: "list",
            choices: ["View Sales Data", "Add New Department","Exit"]
        }
    ]).then((answer)=>{
        switch (answer.choice) {
            case "View Sales Data":
                salesData();
                break;
            case "Add New Department":
                addDepartment();
                break;
            case "Exit":
                process.exit();
        }
    });
}