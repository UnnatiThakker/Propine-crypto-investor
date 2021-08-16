const connection = require("./db");

// constructor function for Investor class
const Investor = function(){}

//member function for import csv file into database
Investor.importFile = (fileName, result) => {
        let query = `LOAD DATA LOCAL INFILE '${fileName}' REPLACE INTO TABLE investor FIELDS 
        TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (timestamp,
        transaction_type,token,amount) set id = NULL;`;
        connection.query(query, (error, response) => {
            result(error, response);
        });
}
//member function to find portfolio by token
Investor.findByToken = (token, result) => {
    let query = `SELECT token, (SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END)
                 - SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END)) as portfolio FROM investor WHERE token = '${token}'`;
    runQuery(query, (error, res) => {
        result(error, res[0]);
    });
}
//member function to find portfolio by date
Investor.findByDate = (date, result) => {
    let query = `SELECT token, (SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END)
                - SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END)) as portfolio FROM 
                investor WHERE cast(timestamp as date) = '1970-01-19' GROUP BY token`;
    runQuery(query, (error, res) => {
        result(error, res);
    });
}
//member function to find portfolio by date and token
Investor.findByTokenNDate = (token, date, result) => {
    let query = `SELECT (SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END)
                - SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END)) as portfolio FROM 
                investor WHERE cast(timestamp as date) = '${date}' AND token = '${token}'`;
                console.log(query);
    runQuery(query, (error, res) => {
        result(error, res[0]);
    });
}
// member function to find portfolio
Investor.findPortfolio = (result) => {
    let query = `SELECT token, (SUM(CASE WHEN transaction_type='DEPOSIT' THEN amount ELSE 0 END)
                - SUM(CASE WHEN transaction_type='WITHDRAWAL' THEN amount ELSE 0 END)) as portfolio FROM 
                investor GROUP BY token`;
    runQuery(query, (error, res) => {
        result(error, res);
    });
}

runQuery = (query, result) => {
    connection.query(query, (error, response) => {
        result(error, response);
    });
}

module.exports = Investor;