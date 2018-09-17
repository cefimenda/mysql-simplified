# mysql-simplified

**mysql-simplified** is a wrapper for the mysql node package that enables interacting with mysql databases only using javascript.

This simple module returns a constructor with each method in the constructor making use of ES6 Promises, allowing users to easily do asynchronous work in an organized manner.

All queries are escaped, so are safe against mysql insertion.

## Setup

You must first make sure to run `npm install mysql-simplified` in your project file to install mysql-simplified.

You will also need an already created database and tables on mysql to connect this module to. You can do this on any mysql client.

Afterwards you can set up mysql-simplified in your node code as follows:

```javascript

const Table = require("mysql-simplified");
let config = {
    //your host name - use localhost if running mysql locally.
    host: "myHostName",
    //port that you are using for your database
    port: 8080,
    //username
    user: "myUserName",
    password: "myPassword",
    //name of the database you will be interacting with
    database: "dbName"
};

//create a variable to access a table named exampleTable on the database with the configurations we defined above.
//the name of the table (i.e. exampleTable) must be entered EXACTLY as it is defined on the database.
var myTable = new Table("exampleTable",config);
//create a connection to the table. 
//Make sure to end connection by running myTable.connection.end() when you are done with your interaction.
var myTable.connect();

```
Make sure to end connection by running `myTable.connection.end()` when you are done interacting with the database, otherwise your connection will remain open and the node process will not end.

## Usage

After defining our table variable and connecting to it with the connect method, we are ready to call any other method on this object. All methods return a promise, so using any method is as simple as the following:

```javascript

myTable.someMethod(parameters).then(function(result){
    //do something
});

```

## Methods

### .connect()

Connects to the table with the defined configurations

---

### .print(columns,limit)

Prints out information from our table in a readable format. 

#### Arguments:

**columns:** OPTIONAL. Defaults to '*' (All). Array of Strings. 

Insert the columns you want to print information from. Insert multiple column names as strings in an array.

**limit:** OPTIONAL. Defaults to '100'. Number.

Set a limit to how many rows of data you want to receive.

#### Code Example:
```javascript

myTable.print().then(function(){
    //do something
    //Note: the resolution of this promise does not return anything.
});

```
Expected result: data gets printed onto the terminal window.

#### MYSQL Query Equivalent:

`SELECT {columns} FROM myTable LIMIT {limit}`

---

### .getItem(conditionColumn,conditionValue,comparison,orderBy,ascendingBoolean,limit)

Returns a list of objects each representing a single row of the table, where keys are column names and values are the data stored in that particular row.

#### Arguments:

**conditionColumn:** REQUIRED. String.

The name of the column that will be used to filter out results.

**conditionValue:** REQUIRED. String or Number.

The value for the column that will be filtered for.

**comparison:** OPTIONAL. Defaults to '='. Takes "=",">" or "<".

How to compare the table value and the desired value.

**orderBy:** OPTIONAL. String.

The name of the column you want your results to be ordered by.

**ascendingBoolean:** OPTIONAL. Boolean. Only used if orderBy is also defined. Defaults to 'true'.

Defines whether the dataset is ordered in an ascending or descending manner. Values of true,undefined,null result in an ascending ordering.

**limit:** OPTIONAL. Number.

Sets a limit to how many results will be returned. If undefined, the method will return all results that match the criteria.

#### Code Example:

```javascript

myTable.getItem("id",1,">","name",false,10).then(function(result){
    console.log(result)
})

```
Expected result: Prints an array of a maximum of 10 objects that have an id larger than 1 ordered by the name of each item in a descending manner.

#### MYSQL Query Equivalent:

`SELECT * FROM myTable WHERE {conditionColumn} {comparison} {conditionValue} ORDER BY {orderBy} {ascendingBoolean --> ASC||DESC} LIMIT {limit}`

---

### .updateTable(updateColumn,newValue,conditionColumn,conditionValue)

Updates the table and returns a success message.

#### Arguments:

**updateColumn:** REQUIRED. String.

The name of the column that will be updated.

**newValue:** REQUIRED. String or Number.

The new value for the column that will be updated.

**conditionColumn:** REQUIRED. String.

The name of the column that will be used to select exactly what column will be updated.

**conditionValue:** REQUIRED. String or Number.

The value that will be looked for to select which row should be updated.

#### Code Example:

```javascript

myTable.updateTable("name",'The Matrix',"id",3).then(function(result){
    console.log(result)
})

```
Expected result: Changes the value for the name column to 'The Matrix' when the id of an item matches '3'. 

Prints out "You have successfully updated the table myTable for {updateColumn} to have a value of {newValue} where {conditionColumn} is equal to {conditionValue}."

#### MYSQL Query Equivalent:

`UPDATE myTable SET {updateColumn} = {newValue} WHERE {conditionColumn} = {conditionValue}`

---

### .append(itemObject)

Appends a new item to the existing table.

#### Arguments:

**itemObject:** REQUIRED. Object.

An object that represents the row of data that will be added to the table. Each key in the object must exactly match a column name on the table, any key that doesn't match a column name will be ignored, and each column that doesn't have a matching key will receive a value of null.

*Keys that correspond to AUTO_INCREMENTed columns will be ignored.*

#### Code Example:

Assuming that we have a database table with columns id(AUTO INCREMENT), name and movieScore:

```javascript

var newItemObject = {
    name:"The Matrix",
    movieScore:10
}
myTable.append(newItemObject).then(function(result){
    console.log(result)
})

```
Expected result: Inserts a new row with a name column of "The Matrix" and a movieScore column of 10. 

Prints out a success object.

#### MYSQL Query Equivalent:

`INSERT INTO myTable {myTable.getColumns()} values ({newItemObject})`

---

### .newGroup(itemList)

Appends a list of items to the existing table.

#### Arguments:

**itemList:** REQUIRED. List of Objects.

A list of objects where each object represents the row of data that will be added to the table. Each key in each object must exactly match a column name on the table, any key that doesn't match a column name will be ignored, and each column that doesn't have a matching key will receive a value of null.

*Keys that correspond to AUTO_INCREMENTed columns will be ignored.*

#### Code Example:

Assuming that we have a database table with columns id(AUTO INCREMENT), name and movieScore:

```javascript

var newItemList = [
    {
        name:"The Matrix",
        movieScore:10
    },
    {
        name:"Mr.Nobody",
        movieScore:8
    }
]

myTable.newGroup(newItemList).then(function(result){
    console.log(result)
})

```
Expected result: Insert new rows with name columns of "The Matrix" and "Mr.Nobody", and movieScore columns of 10 and 8. 

Prints out "2 items successfully added"

#### MYSQL Query Equivalent:

`INSERT INTO myTable {myTable.getColumns()} values ({newItemList})`

---

### .deleteItem(conditionColumn,conditionValue,comparison)

Deletes specified Item/Items based on criteria entered.

#### Arguments:

**conditionColumn:** REQUIRED. String.

The name of the column that will be used to find what will be deleted.

**conditionValue:** REQUIRED. String or Number.

The desired value for the column to find what will be deleted.

**comparison:** OPTIONAL. Defaults to '='. Takes "=",">" or "<".

How to compare the table value and the desired value.

#### Code Example:

```javascript

myTable.deleteItem("id","39",">").then(function(result){
    console.log(result)
})

```
Expected result: Deletes all items in table that have an id larger than 39.

Prints out "You have successfully deleted item(s) with item_id>39."

#### MYSQL Query Equivalent:

`DELETE FROM myTable WHERE {conditionColumn} {comparison} {conditionValue})`

---

### .join(selectArray,joinType,joinTable,onColumn1,onColumn2)

Joins two tables and returns the data for specified columns in JSON format.

#### Arguments:

**selectArray:** REQUIRED. Array of Strings.

The names of the columns that will be selected from the joint table to be returned. All columns must be written out as tableName.columnName.

**joinType:** REQUIRED. String. Choices are LEFT, RIGHT, INNER, OUTER.

Defines how the two tables will be joined.

**joinTable:** REQUIRED. String.

The name of the table that will be joined with the original table defined in the object.

**onColumn1:** REQUIRED. String.

The name of the column in table 1 that is the equivalent of what is provided for the onColumn2 argument, which will be used for merging the two tables.

**onColumn2:** REQUIRED. String.

The name of the column in table 2 that is the equivalent of what is provided for the onColumn1 argument, which will be used for merging the two tables.

#### Code Example:

```javascript

var selectArray = ["purchases.request_id","purchases.seller_id","sellers.ratings","sellers.phone"]
seekingAssistance.join(selectArray,"LEFT",'sellers',"purchases.seller_id","sellers.id").then(function(result){
    console.log(result);
});

```
Expected result: Returns a JSON object displaying values for request_id, and seller_id on the purchases table and 
ratings and phone on the sellers table. The tables have been joined on the columns purchases.seller_id and sellers.id. 

As this is a LEFT join, any items that appear in sellers but not purchases will not be displayed in the return of the function. See MYSQL documentation for more information on JOINs.

#### MYSQL Query Equivalent:

`SELECT {selectArray} FROM myTable {joinType} JOIN {joinTable} ON {onColumn1} = {onColumn2}`

---

### .getColumns()

Returns names of Columns in the table as a list.

#### Code Example:

```javascript

myTable.getColumns().then(function(result){
    console.log(result);
});

```
Expected result: `['column_name1','column_name2','column_name3']` etc.

This method will NOT return any columns that auto_increment.

#### MYSQL Query Equivalent:

`SHOW COLUMNS FROM myTable`

---

### .getMostRecent(orderBy, limit,conditionColumn,conditionValue)

**CURRENTLY ASSUMES THAT THERE IS AN {orderBy} COLUMN THAT IS AUTO_INCREMENTED.**

Returns the last entry/entries that fits set conditions.

#### Arguments:

**orderBy:** REQUIRED. String.

The name of the AUTO_INCREMENTed column that will be used to determine the order with which items were added.

**limit:** OPTIONAL. Number. Defaults to 1.

Sets a limit for how many results will be returned. Will return a single result if limit is undefined.

**conditionColumn:** OPTIONAL. String.

The name of the column that will be compared to conditionValue in order to filter results.

**conditionValue:** OPTIONAL. String or Number.

The desired value for the column to filter what will be returned.

#### Code Example:

```javascript

myTable.getMostRecent("item_id",2,"department_name","Electronics").then(function(result){
    console.log(result)
})

```
Expected result: Prints out the 2 items among those which have a department_name of Electronics that were last added.

#### MYSQL Query Equivalent:

`SELECT * FROM myTable WHERE {conditionColumn} = {conditionValue} ORDER BY {orderBy} DESC LIMIT {limit}`

