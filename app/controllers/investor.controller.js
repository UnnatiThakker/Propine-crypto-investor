const Investor = require("../models/investor.model");
const fetch = require('node-fetch');
const apiConfig = require('../config/config').API;

// import csv file data

exports.importToSQL = (result) => {
    Investor.importFile("./transactions.csv", (err, res) => {
        result(err, res);
    });
}

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

givenTokenAndDate = (token, date, result) => {
    Investor.findByTokenNDate(token, date, (err, res) => {
        if(err){
            result(err, res);
            return;
        } else if(res.portfolio != null){
            getCurrentRate([token], (apiErr, apiRes) => {
                if(apiRes){
                    res.portfolio = res.portfolio * apiRes.USD;
                }
                result(err, res);
            });
        } else {
            res = 'Matching data not found for given token and date';
            result(err, res);
        }
    });
}

givenToken = (token, result) => {
    Investor.findByToken(token, (err, res) => {
        if(err){
            result(err, res);
            return;
        } else if(res.portfolio != null){
            getCurrentRate([token], (apiErr, apiRes) => {
                if(apiRes){
                    res.portfolio = res.portfolio * apiRes.USD;
                }
                result(err, res);
            });
        } else {
            res = 'Matching data not found for given token';
            result(err, res);
        }
    });
}

givenDate = (date, result) => {
    Investor.findByDate(date, (err, res) => {
        if(err){
            result(err, res);
            return;
        } else{
            let tokens = res.map((obj) => obj.token);
            getCurrentRate(tokens, (apiErr, apiRes) => {
                if(apiRes){
                    res = res.map((obj) => {
                        //    console.log(apiRes)
                            obj.portfolio = obj.portfolio * apiRes[obj.token].USD;
                            return obj;
                        });
                }
                result(apiErr, res);
            });
        }
    });
}

givenNoParam = (result) => {
    Investor.findPortfolio((err, res) => {
        if(err){
            result(err, res);
            return;
        } else{
            let tokens = res.map((obj) => obj.token);
            getCurrentRate(tokens, (apiErr, apiRes) => {
                if(apiRes){
                    res = res.map((obj) => {
                            obj.portfolio = obj.portfolio * apiRes[obj.token].USD;
                            return obj;
                        });
                }
                result(apiErr, res);
            });
        }
    });
}

getCurrentRate = (tokens, result) => {
    console.log(tokens)
    let queryString;
    if(tokens.length > 1){
        queryString = `multi?fsyms=${tokens.join(",")}`;
    } else {
        queryString = `?fsym=${tokens.join(",")}`;
    }
    queryString += `&tsyms=USD`;
    console.log(`${apiConfig.GET_RATE}${queryString}`)
    fetch(`${apiConfig.GET_RATE}${queryString}`)
    .then(res => res.json())
    .then(json => result(null, json))
    .catch(err => result(err, null));
}