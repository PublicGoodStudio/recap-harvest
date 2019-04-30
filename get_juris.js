const request = require('request');
const fs = require('fs');


var url = 'https://api.case.law/v1/jurisdictions/';
var qs = {body_format: 'text'};

get_page_of_results(url);

// let's create a function to get a page of results and write them to a file
function get_page_of_results(url) {
  var jurisdictions = [];

  request.get({url:url, qs:qs, json:true}, function (error, response, body) {

    for (var result in body.results) {
      jurisdictions.push(body.results[result].slug);
    }
    fs.appendFileSync('./data/src/helpers/jurisdictions.json',  JSON.stringify(jurisdictions));
  });
}
