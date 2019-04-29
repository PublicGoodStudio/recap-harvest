const request = require('request');
const fs = require('fs');


var url = 'https://api.case.law/v1/cases/';
var qs = { jurisdiction: 'alaska', body_format: 'text'};

get_page_of_results(url);

// let's create a function to get a page of results and write them to a file
function get_page_of_results(next_url) {
  var case_values = [];

  request.get({url:next_url, qs:qs, json:true}, function (error, response, body) {

    for (var result in body.results) {

      case_values.push(body.results[result].id);
      case_values.push(body.results[result].url,);
      case_values.push(body.results[result].name);
      case_values.push(body.results[result].name_abbreviation);
      case_values.push(body.results[result].decision_date);
      case_values.push(body.results[result].court.id);
      case_values.push(body.results[result].jurisdiction.id);

      fs.appendFileSync('./data/src/ak.tsv', case_values.join('\t') + '\n');
    }

    if (body.next  !== null) {
      await sleep(200);
      get_page_of_results(body.next);
    }


  });
}
