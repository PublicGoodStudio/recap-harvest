const request = require('request');
const fs = require('fs');

const url = 'https://api.case.law/v1/cases/';
var params;

const jurisdictions = require("./data/src/helpers/jurisdictions.json");
const ignore_jurisdictions = ['am-samoa', 'dakota-territory', 'dc', 'guam', 'montchr', 'native-american','navajo-nation', 'n-mar-i',
                            'pr', 'regional', 'tribal', 'us', 'vi'];

var filtered_jurisdictions = jurisdictions.filter(function(x) {
  return ignore_jurisdictions.indexOf(x) < 0;
});

//// DEBUG:
const timer = ms => new Promise( res => setTimeout(res, ms));
filtered_jurisdictions = ['fla'];

const jurisdiction_header = ['case_id', 'case_name_abbreviation', 'decision_date', 'court_id'];

for (j in filtered_jurisdictions) {
  params = {jurisdiction: filtered_jurisdictions[j], body_format: 'text'};
  fs.appendFileSync('./data/src/' + params.jurisdiction + '.tsv', jurisdiction_header.join('\t') + '\n');
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
    if (body && body.hasOwnProperty('results')) {
      for (var result in body.results) {
        case_values.push(body.results[result].id);
        case_values.push(body.results[result].name_abbreviation);
        case_values.push(body.results[result].decision_date);
        case_values.push(body.results[result].court.id);

        fs.appendFileSync('./data/src/' + params.jurisdiction + '.tsv', case_values.join('\t') + '\n');
        case_values.length = 0;
      }

      if (body.next !== null) {
        timer(500).then(_=>get_page_of_results(body.next, params));
      }
    }
  });

}
