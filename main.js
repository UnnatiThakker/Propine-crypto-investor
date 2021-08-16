const args = require('minimist')(process.argv.slice(2))
const Investor = require("./app/controllers/investor.controller");


const portfolio = () => {
    this.token = args['token'];
    this.date = args['date'];
    Investor.findPortfolio(this.token, this.date, (err, res) => {
        if(err){
            console.error(err);
        } else{
            console.log(res);
        }
    });
}

const InitialiseData = function() {
    if(args['import']){
        Investor.importToSQL((err, res) => {
            if(err){
                console.error(err);
            } else{
                portfolio();
            }
        });
    } else {
        portfolio();
    }
    
}
InitialiseData();

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });