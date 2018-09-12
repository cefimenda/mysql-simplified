const mysql = require("mysql");
const cTable = require('console.table');

function Table(name, config) {
    this.name = name;
    this.config = config;
    this.getColumns = function () {
        return new Promise((resolve, reject) => {
            var query = "SHOW COLUMNS FROM ??"
            var columns = []
            this.connection.query(query, this.name, function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                for (var i in res) {
                    if (res[i].Extra === "auto_increment") { continue }
                    columns.push(res[i].Field)
                }
                resolve(columns)
            })
        })
    }
    this.connect = function () {
        this.connection = mysql.createConnection(this.config)
    };
    this.print = function (input) {
        return new Promise((resolve, reject) => {
            var query = "SELECT ?? FROM ?? LIMIT ?";
            var filter = input || "*"
            this.connection.query(query, [filter, this.name, 100], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.table(res)
                resolve()
            });
        })
    };
    this.getItem = function (conditionColumn, conditionValue, comparison, orderBy, ascendingBoolean, limit) {
        return new Promise((resolve, reject) => {
            var compare = comparison || "="
            var escaper = [this.name, conditionColumn, conditionValue]
            if (compare === "=") {
                var query = "SELECT * FROM ?? WHERE ?? = ? ";
            } else if (compare === "<") {
                var query = "SELECT * FROM ?? WHERE ?? < ?";
            } else if (compare === ">") {
                var query = "SELECT * FROM ?? WHERE ?? > ?";
            }
            if (orderBy) {
                if (ascendingBoolean || ascendingBoolean === null || ascendingBoolean === undefined) {
                    query += " ORDER BY ?? ASC"
                }
                else {
                    query += " ORDER BY ?? DESC"
                }
                escaper.push(orderBy)
            }
            if (limit) {
                query += " LIMIT ?"
                escaper.push(limit)
            }
            query += ";"
            this.connection.query(query, escaper, function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            });
        })
    };
    this.changeTable = function (changeColumn, newValue, conditionColumn, conditionValue) {
        return new Promise((resolve, reject) => {
            var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?;"
            this.connection.query(query, [this.name, changeColumn, newValue, conditionColumn, conditionValue], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("You have successfully updated the table " + this.name + " for " + propToChange + " to have a value of " + newValueforProp + " where " + columnToTarget + " is equal to " + targetCriteria + ".")
            });
        })
    };
    this.newItem = function (itemObject) {
        return new Promise((resolve, reject) => {
            this.getColumns().then((columnList) => {
                var query = "INSERT INTO ?? (??) values (?);";
                var escaper = [this.name, columnList, []]
                for (var i in columnList) {
                    escaper[2].push(itemObject[columnList[i]])
                }
                this.connection.query(query, escaper, function (err, res) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve("Item successfully added")
                })
            })
        })
    };
    this.newGroup = function (itemList) {
        return new Promise((resolve, reject) => {
            if (itemList.length === 0) {
                reject("Empty List")
                return
            }
            this.getColumns().then((columnList) => {
                var query = "INSERT INTO ?? (??) values ?; ";
                var escaper = [this.name,columnList,[]];
                console.log(itemList)
                for (var i = 0; i<itemList.length; i++) {
                    var item = itemList[i]
                    var itemValues = []
                    for (var n in columnList){
                        itemValues.push(item[columnList[n]])
                    }
                    escaper[2].push(itemValues)
                }
                console.log(query)
                console.log(escaper)
                this.connection.query(query, escaper, function (err, res) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(itemList.length + " items successfully added")
                })
            })
        })
    };
    this.deleteItem = function (conditionColumn, conditionValue, condition) {
        return new Promise((resolve, reject) => {
            if (!condition || condition === "=") {
                var query = "DELETE FROM ?? WHERE ?? = ?";
            } else if (condition === ">") {
                var query = "DELETE FROM ?? WHERE ?? > ?";
            } else if (condition === "<") {
                var query = "DELETE FROM ?? WHERE ?? < ?";
            }
            this.connection.query(query, [this.name, conditionColumn, conditionValue], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("You have successfully deleted item(s) with a " + column + " of " + target + ".")
            })
        })
    }
    this.getMostRecent = function (limit, conditionColumn, conditionValue) {
        return new Promise((resolve, reject) => {
            var query = "SELECT * FROM ??"
            var escaper = [this.name]
            if (conditionColumn && conditionValue) {
                query += "WHERE ?? = ?"
                escaper.push(conditionColumn, conditionValue)
            }
            query += "ORDER BY id DESC"
            if (limit) {
                query += " LIMIT ?"
                escaper.push(limit)
            }
            query += ";"
            this.connection.query(query, escaper, function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            })
        })
    }
}

module.exports = Table

