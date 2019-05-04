// loop through all tsv files
// build a list of years, and for each year, we create or bump the count on the jurisdiction
//
// our end result should look something like when we serialize json
//
//
//{
//  1697: { ala: 23, colo: 21 },
//  1698: { ala: 5, colo: 17, del: 9 }
//}

const fs = require('fs')
var moment = require('moment');

var path = require("path");
var glob = require("glob");


// options is optional
glob("../data/src/*.tsv", function (er, files) {
var ds = {};

  for (f in files) {

      var lines = fs.readFileSync(files[f], 'utf-8').split('\n');

      // ditch our header rows
      lines.shift();



      var year;
      var jurisdiction = path.basename(files[f]).split('.')[0];

      for (var line in lines) {
        if (lines[line].length) {
          // get the decision date as a year
          year = moment( lines[line].split('\t')[2] ).format( "YYYY" );

          // filter out bogus dates
          if (year !== 'Invalid date' && year >= 1658 && year <= 2019){

              if (!(year in ds)) {
                ds[year] = {};
              }


              if (jurisdiction in ds[year]) {
                  ds[year][jurisdiction] = ds[year][jurisdiction] + 1;
              } else {
                ds[year][jurisdiction] = 1;
              }
          }

        }
      }




  //console.log(lines);


  //console.log(files);
    }

    console.log(ds);
    var json = JSON.stringify(ds);
    fs.writeFile('../data/bundled/counts-by-year-and-jurisdiction.json', json, 'utf8',
    function(err) {
      if (err) throw err;
      console.log('complete');

      });
})
