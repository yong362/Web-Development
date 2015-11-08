#Unit Test
##Installation 
This project is build based on Node.js
<br><code>npm install</code> to install package, if having error of installing package please install each package manually
<br/><code>npm install moment</code>
<br/><code>npm install request</code>
<br/><code>npm install walk</code>
<br/><code>npm install fs</code>
<br/><code>npm install xml2js</code>
<br/><code>npm install path</code>
<br/><code>npm install form-data</code>
<br/><code>npm install json2xls</code>
<br/><code>npm install exceljs</code>
<br/><code>npm install msexcel-builder</code>
<br/><code>npm http-server -g</code>
##Usage
Running the code below will allows you to read run the unit test, reading the result from the designated folder and sending the unit test result to the database.
<br>To run Unit Test 
<br/>jasmine-node --junitreport [location of file] --output [location to save unit test report]
<br>E.g. <code>jasmine-node --junitreport test/spec/MainTest_spec.js --output ./reports/ </code>

Running the code below allows you to generate a excel spreadsheet from the RAML. This excel spreadsheet helps tester to keep track of the test cases that they have created afterwhich upload to the database to notify other tester of which API test cases had been created. This allow reduction of miscomunication and reduce the chances of duplicated codes. 
<br>To run generate excel file from raml
<br> node [location of file]
<br>E.g. <code>node test\spec\Raml2excel.js</code>

Running the code below allows you to run the website on you own local machine. This is good for those developers who are intending to modify the UI.
To run local server
<br> http-server
<Br> E.g. <code> http-server</code>
##Modification of codes
<h5>To create a test cases</h5>
Start with `frisby.create` with a description of the test followed by one of `get`, `post`, `put`, `delete`, or `head`, and ending with `run` to generate the resulting jasmine spec test. There is a `expectStatus` method built in to more easily test HTTP status codes. Any other jasmine `expect` tests should be done inside the `after` callback.

Each set of unique sequences or API endpoint tests should be started with new `frisby.toss` method calls instead of trying to chain multiple HTTP requests together.

For more infomation regarding how to create test cases using frisby
<br/><link>https://github.com/vlucas/frisby</link>

Make sure your save location of unit test report are match to the output when you are running the test
<br>To modify the location of the save output location 
<br><code>var walker = walk.walk('the location where you want to save report to', {
     followLinks: false
 });
 </code>
<br>By default the report will be save in <code>./reports</code>

<h5><code> Raml2excel.js</code></h5>
As for Raml2excel.js, most of the documentation is located in the JavaScript itself. 
<br> For more information for those codes
<br> raml-parser - <link>https://github.com/raml-org/raml-js-parser</link>
<br> exceljs - <link>https://github.com/guyonroche/exceljs#reading-xlsx</link>
<br> msexcel-builder - <link>https://github.com/chuanyi/msexcel-builder</link>
