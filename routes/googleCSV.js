var request = require('request')
var csv = require('binary-csv')
var concat = require('concat-stream')

module.exports = function makeTable(req,res) {
  var key = req.query.key || req.body.key;
  
  var base = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=' 
  var query = '&single=true&gid=0&output=csv'
  var URL = base + key + query
    
  var csvParser = csv({json: true})
  
  request(URL).pipe(csvParser).pipe(concat(row))

  function row(data){
    res.send(data)
  }

}