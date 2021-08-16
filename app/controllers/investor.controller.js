const Investor = require("../models/investor.model");
const fetch = require('node-fetch');
const apiConfig = require('../config/config').API;

// import csv file data
exports.importToSQL = (result) => {
    Investor.importFile("./transactions.csv", (err, res) => {
        result(err, res);
    });
}
// find portfolio
exports.findPortfolio = (token, date, result) => {
    if(token && date){
        givenTokenAndDate(token, date, ((err, res) => {
           result(err,res);
       }));
    } else if(token){
        givenToken(token, ((err, res) => {
            result(err,res);
        }));
    } else if(date){
        givenDate(date, (err,res) => {
            result(err,res);
        });
    } else {
        givenNoParam((err,res) => {
            result(err,res);
        });
    }
    
}
// if token & date present to find portfolio
givenTokenAndDate = (token, date, next) => {
    Investor.findByTokenNDate(token, date, (err, res) => {
        if(err){
            next(err);
        } else if(res.portfolio != null){
            getCurrentRate([token], (apiErr, apiRes) => {
                if(apiErr){
                    next(new Error("Error in connecting API"));
                } else {
                    res.portfolio = res.portfolio * apiRes.USD;
                    next(null, res);
                }
            });
        } else {
            next(new Error("Matching data not found for given token and date"));
        }
    });
}
// if token present to find portfolio
givenToken = (token, next) => {
    Investor.findByToken(token, (err, res) => {
        if(err){
            next(err);
        } else if(res.portfolio != null){
            getCurrentRate([token], (apiErr, apiRes) => {
                if(apiErr){
                    next(new Error("Error in connecting API"));
                } else {
                    res.portfolio = res.portfolio * apiRes.USD;
                    next(null, res);
                }
            });
        } else {
            next(new Error("Matching data not found for given token"));
        }
    });
}
// if date present to find portfolio
givenDate = (date, next) => {
    Investor.findByDate(date, (err, res) => {
        if(err){
            next(err);
        } else if(res.length){
            let tokens = res.map((obj) => obj.token);
            getCurrentRate(tokens, (apiErr, apiRes) => {
                if(apiErr){
                    next(new Error("Error in connecting API"));
                } else {
                    res = res.map((obj) => {
                            obj.portfolio = obj.portfolio * apiRes[obj.token].USD;
                            return obj;
                        });
                        next(null, res);
                }
            });
        } else {
            next(new Error("Matching data not found for given date"));
        }
    });
}
// if no parameter given to find portfolio
givenNoParam = (next) => {
    Investor.findPortfolio((err, res) => {
        if(err){
            next(err);
        } else{
            let tokens = res.map((obj) => obj.token);
            getCurrentRate(tokens, (apiErr, apiRes) => {
                if(apiErr){
                    next(new Error(apiErr));
                } else {
                    res = res.map((obj) => {
                            obj.portfolio = obj.portfolio * apiRes[obj.token].USD;
                            return obj;
                        });
                    next(null, res);
                }
            });
        }
    });
}
// API call to get crypto rate in USD 
getCurrentRate = (tokens, result) => {
    let queryString;
    if(tokens.length > 1){
        queryString = `multi?fsyms=${tokens.join(",")}`;
    } else {
        queryString = `?fsym=${tokens.join(",")}`;
    }
    queryString += `&tsyms=USD`;
    fetch(`${apiConfig.GET_RATE}${queryString}`)
    .then(res => res.json())
    .then(json => result(null, json))
    .catch(err => result(err, null));
}