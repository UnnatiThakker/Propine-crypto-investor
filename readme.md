# Overview

This project aims to dump a large CSV data into the database and find portfolio value by calculating the amount by adding deposits and subtracting withdrawals, then converting the final amount to USD crypto rate for a given token.

## Objectives

*The goal of this project is to import CSV data to the MySQL database and perform the following operations: *

* Find a portfolio of a given token
* Find portfolio on given date group by token
* Find portfolio for given token and date
* Find portfolio for all tokens

## Success metrics

*Code should run properly and it should be easily maintained.*

# Prerequisite

Make sure you have node.js and MySQL installed on the system, if not please download from here; [node.js](https://nodejs.org/en/download/) & [MYSQL](https://www.mysql.com/downloads/).

Start your MySQL server using `mysql -u <username> -p` and run script(investor.mysql) file to create database, table, and indexes. 

Add database user, password, and API key to config.js file.

Run npm install to download all the dependencies of the project.

# Flow

Start node.js application using `node main.js` which is the entry point, but make sure to run the application using `--import=1` if you are running this app for the very first time. It will tell the application to import a CSV file to MySQL database before querying for results. 

Once you have imported data into the system you can query them using below option. You can combine them with import as well

* `node main.js` will search for the portfolio where no parameters are defined.
* `node main.js --token=\`${token_name}\``will find portfolio for the given token  
* `node main.js --date=\`${yyyy-mm-dd}\`` will find portfolio for given date group by tokens
* *node main.js --token=\`${token_name} \` --date=\`${yyyy-mm-dd}\`* will find portfolio for a given date and token


![flowchart](https://user-images.githubusercontent.com/6748244/129595784-2347671f-6919-4be4-ab03-754518523d64.png)

