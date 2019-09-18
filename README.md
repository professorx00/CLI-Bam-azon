# Bamazon

## Description

This application implements a simple command line based storefront using the npm [inquirer](https://www.npmjs.com/package/inquirer) package, the MySQL database backend together with the npm [mysql](https://www.npmjs.com/package/mysql) package, for table creation [cli-table](https://www.npmjs.com/package/cli-table) package, and finally we have [cli-logo](https://www.npmjs.com/package/cli-logo) package for logo creation. The application presents three interfaces: **customer**,**manager**,and **supervisor**.

### MySQL Database Setup

In order to run this application, you should have the MySQL database already set up on your machine. If you don't, visit the [MySQL installation page](https://dev.mysql.com/doc/refman/5.6/en/installing.html) to install the version you need for your operating system. Once you have MySQL isntalled, you will be able to create the *Bamazon* database and the *products* table with the SQL code found in [bamazon-9-17-2019.sql](bamazon-9-17-2019.sql). Run this code inside your MySQL client like [Sequel Pro](https://www.sequelpro.com/) to populate the database, then you will be ready to proceed with running the Bamazon customer,manager, and supervisor interfaces.

Once you have the Database setup you should in directory of program run:

    ```
    npm install

    ```
which will install all require packages.

### Customer Interface

The customer interface allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located and price. The user is then able to purchase one of the existing items by entering the item ID and the desired quantity. If the selected quantity is currently in stock, the user's order is fulfilled, displaying the total purchase price and updating the store database. If the desired quantity is not available, the user is prompted to modify their order.

To run the customer interface please follow the steps below:
	
    ```
    node customer.js

    ```
This will cause the program to prompt for the item number and Quantiy wanting to purchase.

    ? What product ID would you like to purchase?('exit' to quit) 17
    ? How many Units would you like to purchase? 1
    You Purchased 1 of Water Bottle 116oz for a total of 23.55
    Processing...

### Supervisor Interace

The supervisor interface presents a list of two options, as below. 

    ? Which do you want to do? (Use arrow keys)
    > View Sales Data
    Add New Department
    Exit
	  
The **View Sales Data** option allows the user to view the each Departments Department Name,Deptartment ID,Over Head Cost, and Profit

The **Add Department** option allows the user to add Department into the database.

the **Exit** exits the program


To run the supervisor interface please follow the steps below:
	
    ```
    node supervisor.js

    ```

### Manager Interace

The manager interface presents a list of four options, as below. 

    ? Please choose which option you need (Use arrow keys)
    > View Products for Sale
    View Low Inventory
    Add to Inventory
    Add New Product
    Exit
	  
The **View Products for Sale** option allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located, price, and the quantity available in stock. 

The **View Low Inventory** option shows the user the items which currently have fewer than 10 units available.

The **Add to Inventory** option allows the user to select a given item ID and add additional inventory to the target item.

The **Add New Product** option allows the user to enter details about a new product which will be entered into the database upon completion of the form.

the **Exit** exits the program

To run the manager interface please follow the steps below:
	
    ```
    node manager.js

    ```

### Bamazon Demos:
Here is a You PlayList of all operations above.
[Bamazon PlayList of Tutorials](https://www.youtube.com/playlist?list=PLDjUGxwP9HUBOTLFePG2UwSdoOPFMqYd8)


