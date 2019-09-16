const Table = require('cli-table');
const mysql = require('mysql');
const inquirer = require('inquirer');

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

let table = new Table({head: ['Department ID', 'Department Name', 'Over Head Cost', 'Product Sales', 'Profit'], colWidths: [20, 20, 20, 20, 20]});

function salesData() {
    database.query("select department.dept_id,department.dept_name,department.over_head,products.product_sales from department left join products on department.dept_id=products.dept_ID group by department.dept_id", (err, res)=>{
        if(err) throw err;
        res.forEach(element => {
            let profit = parseFloat(element.product_sales)-parseFloat(element.over_head);
            let row=[element.dept_id,element.dept_name,element.over_head,element.product_sales,profit]
            table.push(row)
        });
        console.log(table.toString());
        start();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            name:"name",
            message:"What is the new Department Name?",
            type:"input"
        },
        {
            name:"overHead",
            message:"What is the Over Head Cost for the Department?",
            type:"number"
        }
    ]).then((answers)=>{
        let name=answers.name;
        let overHead = answers.overHead;
        database.query(`INSERT INTO department (dept_name,over_head) VALUES (${name},${overHead});`,(err,res)=>{
            if(err) throw err;
            if(res){console.log(`${name} has been added to the database.`)}
            start();
        })
    })
};



function start() {
    inquirer.prompt([
        {
            name: "choice",
            message: "Which do you want to do?",
            type: "list",
            choices: ["View Sales Data", "Add New Department"]
        }
    ]).then((answer)=>{
        switch (answer.choice) {
            case "View Sales Data":
                salesData();
                break;
            case "Add New Department":
                addDepartment();
                break;
        }
    });
}