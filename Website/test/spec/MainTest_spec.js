 var frisby = require('frisby');
 var moment = require('moment');
 var request = require('request');
 var flexUrl = "http://cxa-dev-api.azurewebsites.net/",
     authUrl = "http://cxa-dev-api.azurewebsites.net/",
     authUrl2 = "http://cxa-dev-api.azurewebsites.net/",
     entityUrl = "http://cxa-dev-api.azurewebsites.net/";
 var AuthTest_spec = require("../spec/New_AuthTest_spec.js"),
     ClaimTest_spec = require("../spec/New_ClaimTest_spec"),
     EntityTest_spec = require("../spec/EntityTest_spec.js"),
     flexTestsam_spec = require("../spec/flexTestsam_spec.js");
 var walk = require('walk');
 var files = [],
     authResult = [],
     globalResult = [],
     entityResult = [],
     flexResult = [],
     claimResult=[];
 var fs = require('fs'), xml2js = require('xml2js');

 // Walker options - Reading of all reports file name
 var walker = walk.walk('./gauge/reports', {
     followLinks: false
 });
 walker.on('file', function(root, stat, next) {
     // Add this file to the list of files
     files.push(stat.name);
     next();
 });
 var test = function() {

        //Convert reports in xml to json
     var parser = new xml2js.Parser();
     for (var i = 0; i < files.length; i++) {
         fs.readFile('./gauge/reports/' + files[i], function(err, data) {
             parser.parseString(data, function(err, result) {

                //get values from json
                 var test = result.testsuites.testsuite[0].$.name,
                     failure = result.testsuites.testsuite[0].$.failures,
                     time = result.testsuites.testsuite[0].$.timestamp,
                     message, messageLength;
                 if (failure === "1") {
                     messageLength = result.testsuites.testsuite[0].testcase[0].failure.length;
                     if (messageLength > 1) {
                         for (var j = 0; j < messageLength; j++) {
                             message += "<br>" + result.testsuites.testsuite[0].testcase[0].failure[j].$.message;
                         }
                     } else if (messageLength == 1) {
                         message = result.testsuites.testsuite[0].testcase[0].failure[0].$.message
                     }

                 } else {
                     message = 'N/A';
                 }
                 var validation, fail;

                 if (failure === "0") {
                     validation = "glyphicon glyphicon-ok";
                     fail = false;

                 } else if (failure === "1") {

                     validation = "glyphicon glyphicon-remove";
                     fail = true;
                 }
                 if (test.indexOf('AuthTest') >= 0) {
                     authResult.push({
                         name: test,
                         failures: fail,
                         reason: message,
                         time: moment(time).format()
                     });
                 } else if (test.indexOf('GlobalTest') >= 0) {
                     globalResult.push({
                         name: test,
                         failures: fail,
                         reason: message,
                         time: moment(time).format()
                     });

                 } else if (test.indexOf('EntityTest') >= 0) {
                     entityResult.push({
                         name: test,
                         failures: fail,
                         reason: message,
                         time: moment(time).format()
                     });

                 } else if (test.indexOf('FlexTest') >= 0) {
                     flexResult.push({
                         name: test,
                         failures: fail,
                         reason: message,
                         time: moment(time).format()
                     });

                 } else if (test.indexOf('ClaimTest') >= 0) {
                     claimResult.push({
                         name: test,
                         failures: fail,
                         reason: message,
                         time: moment(time).format()
                     });

                 }


             });
         });
     }
     setTimeout(function() {
         var postAuth = {
             testTypeID: 1,
             date: moment().format(),
             unitTypeID: 1,
             detailUnit: authResult,
             detailGlobal: globalResult
         };
         var postFlex = {
             testTypeID: 1,
             date: moment().format(),
             unitTypeID: 2,
             detailUnit: flexResult,
             detailGlobal: globalResult
         };
         var postEntity = {
             testTypeID: 1,
             date: moment().format(),
             unitTypeID: 3,
             detailUnit: entityResult,
             detailGlobal: globalResult
         };
         var postClaim = {
             testTypeID: 1,
             date: moment().format(),
             unitTypeID: 4,
             detailUnit: claimResult,
             detailGlobal: globalResult
         };

         function postResult(data) {
             var options = {
                 // url: 'http://localhost:64737/api/1/results',
                 url: 'https://ystest.azurewebsites.net/api/1/results',
                 headers: {
                     name: 'content-type',
                     value: 'application/json'
                 },
                 body: data,
                 json: true,

                 method: 'post'
             };

             function callback(error, response, body) {
                 successCallback = this;

                 if (!error && response.statusCode == 200) {
                     var info = JSON.parse(body);
                 }
             }
             request(options, callback);
         }
         postResult(postAuth);
         postResult(postEntity);
         postResult(postFlex);
         postResult(postClaim);
     }, 1000);
 };


 /*=======================API Test Directory========================
      1. Getting sessionToken
     3.1 Change Password API
     3.2 Complete Reset Password API
     3.3 Initiate Reset Password API
    
     ===============End Of Directory========================*/

 /*========================================================================================================================
 ==========================================1. Getting sessionToken========================================================
 ==========================================================================================================================*/
 frisby.create('GlobalTest - POST login details')
     .post(authUrl2 + 'api/1/user/login', {
         "userName": "root",
         "clientName": "root",
         "password": "root"
     }, {
         json: true
     }, {
         headers: {
             'Content-Type': 'application/json'
         }
     })
     .expectStatus(200)
     .expectHeader('Content-Type', 'application/json; charset=utf-8')
     .expectJSONTypes({
         token: String
     })
     .afterJSON(function(res) {
         /* include auth token in the header of all future requests */
         frisby.globalSetup({
             request: {
                 headers: {
                     'sessionToken': res.token
                 }
             }
         });
         console.log("TEST Under Auth API");
         AuthTest_spec.AuthTest();
         // console.log("TEST Under Entity API");
         EntityTest_spec.EntityTest();
         // console.log("TEST Under AUTH API");
         ClaimTest_spec.ClaimTest();
         // FlexPYS_spec.FlexTest();



          flexTestsam_spec.FlexTest();

     })
     .toss()
 setTimeout(function() {
     test();
 }, 5000);
