const request = require('request');
const fs = require('fs');

var url = 'https://api.case.law/v1/cases/';
var params;

var jurisdictions = require("./data/src/helpers/jurisdictions.json");



for (j in jurisdictions) {
  params = {jurisdiction: jurisdictions[j], body_format: 'text'};
  get_page_of_results(url, params);
}


// let's create a function to get a page of results and write them to a file
function get_page_of_results(next_url, params) {
  console.log('processing ' + params.jurisdiction);
  var case_values = [];
  request.get({url:next_url, qs:params, json:true}, function (error, response, body) {
    if (error) {
      console.log(error);
    }

    if (body && 'results' in body) {
      for (var result in body.results) {
        case_values.push(body.results[result].id);
        case_values.push(body.results[result].url,);
        case_values.push(body.results[result].name);
        case_values.push(body.results[result].name_abbreviation);
        case_values.push(body.results[result].decision_date);
        case_values.push(body.results[result].court.id);
        case_values.push(body.results[result].jurisdiction.id);

        fs.appendFileSync('./data/src/' + params.jurisdiction + '.tsv', case_values.join('\t') + '\n');
      }

      if (body.next !== null) {
        get_page_of_results(body.next, params);
      }
    }
  });

}
