var key  = require('../key.json');

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var Promise = require("bluebird");

var sheet;

function ReadGoogleSheet(sheetId){
  var doc = new GoogleSpreadsheet(sheetId);
  var sheet;
  var self = this;
  self.doRead = function() {
    return new Promise(function (resolve, reject){
        async.series([
            function setAuth(step){
              var creds = require('../key.json');
              doc.useServiceAccountAuth(creds, step);
            },
            function getData(step){
              doc.getInfo(function(err, info){
                if(err){
                  console.log("ERROR IN SHEET READER", err);
                  reject(err);
                }
                sheet = info.worksheets[0];
                step();
              });
            },
            function getRows(step){
              sheet.getRows({
                offset: 1
              }, 
              function(err, rows){
                if(err){
                  console.log(err);
                  reject(err);
                }
                resolve(rows);
              }
              )
            }
        ])
    });
  }
}


module.exports = ReadGoogleSheet;
