### Instruction

Start your mysql server and run script(investor.mysql) file to configure pre-requisite. 

Run npm install to dowload all the dependencies of the project.

Add database user, password and API key to config.js file.

### How it works?

Run node main.js --token=$token_value --date=yyyy-mm-dd --import=1

There are four cases to run this project
- Given no parameters, run node main.js
- Given a token, run node main.js --token=$token_value
- Given a date, run node main.js --date=yyyy-mm-dd
- Given a date and a token, run node main.js --token=$token_value --date=yyyy-mm-dd
Also, --import=1 will tell that data need to import from csv file

### Implementation Explined
When Application starts, it will check if data needs to be imported or already imported based on argument we provide. Once data hase been imported, it will search for data based on provided criteria.
Model will return required data and if data found, it will call crypto API to get current rate in USD and convert portfolio vaue in USD.

To load csv file data, I have used LOAD DATA query which will be faster than other simple inser options.

