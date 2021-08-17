const connection = require("./db");

// constructor function for Investor class
const Investor = function(){}

//member function for import csv file into database
Investor.importFile = (fileName, next) => {
        let query = `LOAD DATA LOCAL INFILE '${fileName}' REPLACE INTO TABLE investor FIELDS 
        TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (timestamp,
        transaction_type,token,amount) set id = NULL;`;
        connection.query(query, (error, response) => {
            next(error, response);
        });
}
//member function to find portfolio by token
Investor.findByToken = (token, next) => {
    let query = `SELECT token, (SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END)
                 - SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END)) as portfolio FROM investor WHERE token = '${token}'`;
    runQuery(query, (error, res) => {
        next(error, res[0]);
    });
}
//member function to find portfolio by date
Investor.findByDate = (date, next) => {
    let query = `SELECT token, (SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END)
                - SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END)) as portfolio FROM 
                investor WHERE DATE_FORMAT(FROM_UNIXTIME(timestamp/1000), '%Y-%m-%d') = '${date}' GROUP BY token`;
    runQuery(query, (error, res) => {
        next(error, res);
    });
}
//member function to find portfolio by date and token
Investor.findByTokenNDate = (token, date, next) => {
    let query = `SELECT (SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END)
                - SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END)) as portfolio FROM 
                investor WHERE DATE_FORMAT(FROM_UNIXTIME(timestamp/1000), '%Y-%m-%d') = '${date}' AND token = '${token}'`;
    runQuery(query, (error, res) => {
        next(error, res[0]);
    });
}
// member function to find portfolio
Investor.findPortfolio = (next) => {
    let query = `SELECT token, (SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END)
                - SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END)) as portfolio FROM 
                investor GROUP BY token`;
    runQuery(query, (error, res) => {
        next(error, res);
    });
}

runQuery = (query, next) => {
    connection.query(query, (error, response) => {
        next(error, response);
    });
}

module.exports = Investor;