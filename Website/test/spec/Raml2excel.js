var raml = require('raml-parser');
var fs = require('fs');
var json2xls = require('json2xls');
var alasql = require('alasql');
var ramlData = [],
    excelData = [],
    ramlDir = ['test/spec/raml.raml', 'test/spec/raml (1).raml', 'test/spec/raml (2).raml'];
var Excel = require("exceljs");
var excelbuilder = require('msexcel-builder');

/*/-------------------- Load raml file for new data ---------------------------------/*/
for (var i = 0; i < ramlDir.length; i++) {
    raml.loadFile(ramlDir[i]).then(function(data) {
        var count = data.resources.length;
        // console.log(count);
        for (var i = 0; i < count; i++) {
            // console.log(data.resources[i]);

            ramlData.push(
                data.resources[i].relativeUri
            );

            // console.log(flexURI);
        }
    }, function(error) {
        console.log('Error parsing: ' + error);
    });
}

/*/-------------------- Read existing data ---------------------------------/*/

var workbook = new Excel.Workbook();
workbook.xlsx.readFile('./cxa.xlsx')
    .then(function() {
       var worksheet = workbook.getWorksheet("sheet1");
       var dobCol = worksheet.getColumn(2);
       // console.log(dobCol);
//        worksheet.eachRow(function(row, rowNumber) {
//     console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
// });
   dobCol.eachCell(function(cell, rowNumber) {
    excelData.push(
        cell.value
        );
    // console.log("Row " + rowNumber + " = " + JSON.stringify(cell.value));
});
    }); 
    setTimeout(function() {
console.log(excelData)
}, 2000);
setTimeout(function() {

    /*/-------------------- Write to new file ---------------------------------/*/

    // Create a new workbook file in current working-path  
    var workbook = excelbuilder.createWorkbook('./', 'cxa.xlsx')

    var sheet1 = workbook.createSheet('sheet1', 10, 400);
    sheet1.width(1, 120);
    // Fill some data 
    for (var i = 1; i <= excelData.length; i++)
    // console.log(flexURI.length +"var i = "+i);
        sheet1.set(2, i, excelData[i-1]);

    for (var i = 1; i <= ramlData.length; i++)
    // console.log(flexURI.length +"var i = "+i);
        sheet1.set(1, i, ramlData[i - 1]);

    // Save it 
    workbook.save(function(ok) {
        if (!ok)
            workbook.cancel();
        else
            console.log('congratulations, your workbook created');
    });
}, 2000);
