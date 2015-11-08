/*========================================================================================================================
========================================== API TESTING ===================================================================
==========================================================================================================================*/

var frisby = require('frisby');
var flexUrl = "http://cxa-dev-api.azurewebsites.net",
    authUrl = "http://cxa-dev-api.azurewebsites.net",
    authUrl2 = "http://cxa-dev-api.azurewebsites.net",
    entityUrl = "http://cxa-dev-api.azurewebsites.net"

var fs = require('fs');
var path = require('path');
var FormData = require('form-data');
var logoPath = path.resolve(__dirname, '../spec/test.png');
var binaryData = [0xDE, 0xCA, 0xFB, 0xAD];
var form = new FormData();

form.append('file_1', fs.createReadStream(logoPath), {
    knownLength: fs.statSync(logoPath).size // we need to set the knownLength so we can call  form.getLengthSync()
});

/*=======================Directory========================
    0.1 Invalid Token && Expire Token Testing
    0.2 Getting sessionToken
    1. Get Entity By Entity ID API
===============End Of Directory========================*/


var EntityTest = function() {

frisby.create('Create a new entity -Null entityname')
         .post(entityUrl + "api/1/entity/create?sessionToken=" + json.token, {

             "status": "Pending",
             "effectiveDate": null,
             "value": {
                 "objectId": 0,
                 "entityName": "",
                 "companyRegistrationNumber": "SG-2015-05-231",
                 "registeredName": "Fake Entity by samuel Pte Ltd #1",
                 "registeredInCountryCode": "SG",
                 "parentEntityId": "",
                 "groupName": "TestGroup",
                 "isParentEntityLogicalParent": false,
                 "taxRegistrationNumber": "NA",
                 "hasCheckedDowJonesWatchList": false,
                 "registrationCertificate": "",
                 "contacts": [{
                     "type": "client.billing.wellness",
                     "name": "Ricky Matias",
                     "position": "",
                     "phone1": "66598082",
                     "phone2": "",
                     "mobilePhone": "",
                     "fax": "",
                     "emailAddress": "samuel@cxagroup.com",
                     "address1": "1 Commonwealth Lane",
                     "address2": "#07-25 One Commonwealth",
                     "city": "Singapore",
                     "countryCode": "SG",
                     "postalCode": "149544"
                 }]
             }
         }, {
             json: true
         }, {
             headers: {
                 'Content-Type': 'application/json'
             }
         })
 .afterJSON(function(json) {
            expect(json.message).toMatch("Validation failed");
        })
         .expectStatus(400).toss()


frisby.create('Create a new entity - Max name length')
         .post(entityUrl + "api/1/entity/create?sessionToken=" + json.token, {

             "status": "Pending",
             "effectiveDate": null,
             "value": {
                 "objectId": 0,
                 "entityName": "ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
                 "companyRegistrationNumber": "SG-2015-05-231",
                 "registeredName": "Fake Entity by samuel Pte Ltd #1",
                 "registeredInCountryCode": "SG",
                 "parentEntityId": "",
                 "groupName": "TestGroup",
                 "isParentEntityLogicalParent": false,
                 "taxRegistrationNumber": "NA",
                 "hasCheckedDowJonesWatchList": false,
                 "registrationCertificate": "",
                 "contacts": [{
                     "type": "client.billing.wellness",
                     "name": "Ricky Matias",
                     "position": "",
                     "phone1": "66598082",
                     "phone2": "",
                     "mobilePhone": "",
                     "fax": "",
                     "emailAddress": "samuel@cxagroup.com",
                     "address1": "1 Commonwealth Lane",
                     "address2": "#07-25 One Commonwealth",
                     "city": "Singapore",
                     "countryCode": "SG",
                     "postalCode": "149544"
                 }]
             }
         }, {
             json: true
         }, {
             headers: {
                 'Content-Type': 'application/json'
             }
         })
 .afterJSON(function(json) {
            expect(json.message).toMatch("Validation failed");
             expect(json.extra.entityName.description).toMatch("Field length exceeds maximum");
            expect(json.code).toEqual(409);
        })
         .expectStatus(400).toss()



 frisby.create('EntityTest - (GET) All Entity')
        .get(entityUrl + "api/1/Entity?sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(200)
        .toss();

frisby.create('EntityTest - (GET) Entityid all fields')
        .get(entityUrl + "api/1/entity/CRM503?includeAllFields&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(200)
        .toss();

 frisby.create('EntityTest - (GET) myEntity')
        .get(entityUrl + "api/1/entity/myEntity?sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(200)
        .toss();

 frisby.create('EntityTest - (GET) Search')
        .get(entityUrl + "api/1/entity?offset&limit&includeAllFields&includePending&includeDraft&parentEntityId&keyword&relatedTo&minDepth&maxDepth&entityIds&groupName&ownerId&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(200)
        .toss();       

frisby.create('EntityTest - (GET) Entity group')
        .get(entityUrl + "api/1/entitygroup?offset&limit&keyword&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(200)
        .toss();
       
frisby.create('EntityTest - byOwnerId')
        .get(entityUrl + "api/1/entity/CRM504?offset&limit&parentEntityId&keyword&relatedTo&minDepth&maxDepth&entityIds&groupName&ownerId&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(200)
        .toss();

frisby.create('EntityTest - (GET) Pending summary')
        .get(entityUrl + "api/1/entity/pending/summary?objectId&offset&limit&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(200)
        .toss();              

frisby.create('EntityTest - (GET) Pending object id')
        .get(entityUrl + "api/1/entity/pending?objectId=1&offset&limit&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(200)
        .toss();             

    /*===============================================================================================================
     ========================================== 1. Get Entity By Entity ID API =======================================
    ===============================================================================================================*/

    frisby.create('EntityTest - Entityid api')
        .get(entityUrl + "api/1/Entity/CRM503?sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')

    .afterJSON(function(json) {
            expect(json.objectId).toEqual(301);
        })
        .expectStatus(200)
        .toss();

    frisby.create('EntityTest - Invalid Entityid api')
        .get(entityUrl + "api/1/Entity/CRM1?sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .expectStatus(400)
        .afterJSON(function(json) {
            expect(json.message).toMatch("entity object not found");
        })
        .toss();


    /*===============================================================================================================
         ========================================== 2. Get Entity by Object ID Api ====================================
          =============================================================================================================*/

    frisby.create('EntityTest - Valid objectId api')
        .get(entityUrl + "api/1/entity/getByObjectId/66?sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.objectId).toEqual(66);
        })
        .expectStatus(200)
        .toss();

    frisby.create('EntityTest - Invalid objectId api')
        .get(entityUrl + "api/1/entity/getByObjectId/@123?sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')

    .afterJSON(function(json) {
            expect(json.message).toMatch("The request is invalid.");
        })
        .expectStatus(400)
        .toss();



    /*===============================================================================================================
        ======================================== 3. Get entity Accepted changes API ====================================
    ===============================================================================================================*/

    frisby.create('EntityTest - entity-accepted api')
        .get(entityUrl + "api/1/entity/accepted?sessionToken=" + json.token + "&objectId=1392&offset=:offset&limit=:limit&userId=:userId")
        .afterJSON(function(json) {
            expect(json.total).toBe(0);
            expect(json.params.objectId).toEqual(1392);
            /*  expect(json.params.keyword).toMatch(json.results[0].entityName);
              expect(json.params.entityIds).toMatch(json.results[0].entityIds);*/

        })
        .expectStatus(200)
        .toss()

    frisby.create('EntityTest - Invalid accepted api')
        .get(entityUrl + "api/1/entity/accepted?sessionToken=" + json.token + "&objectId=2&offset=:offset&limit=:limit&userId=:userId")
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.total).toBe(0);
        })
        .expectStatus(200)
        .toss()

    /*===============================================================================================================
    ======================================== 4. Get entity Pending changes API ====================================
    ===============================================================================================================*/

    frisby.create('EntityTest - entity-pending all api')
        .get(entityUrl + "api/1/entity/pending?sessionToken=" + json.token + "&objectId=:objectId&offset=:offset&limit=:limit&userId=:userId")
        .expectStatus(200)
        .toss()

    frisby.create('EntityTest - Invalid pending api')
        .get(entityUrl + "api/1/entity/pending?sessionToken=" + json.token + "&objectId=2&offset=:offset&limit=:limit&userId=:userId")
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.total).toBe(0);
        })
        .expectStatus(200)
        .toss()
 

    /*===============================================================================================================
    ======================================== 5. Get entity Decline changes API ====================================
    ===============================================================================================================*/

    frisby.create('EntityTest - entity-declined api')
        .get(entityUrl + "api/1/entity/declined?sessionToken=" + json.token + "&objectId=:objectId&offset=:offset&limit=:limit&userId=:userId")
        .expectStatus(200)
        .toss()

    frisby.create('EntityTest - Invalid declined api')
        .get(entityUrl + "api/1/entity/declined?sessionToken=" + json.token + "&objectId=2&offset=:offset&limit=:limit&userId=:userId")
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.total).toBe(0);
        })
        .expectStatus(200)
        .toss()

    /*===============================================================================================================
    ======================================== 6. Search entity ======================================================
    ===============================================================================================================*/

    frisby.create('EntityTest - Search Entity api')
        .get(entityUrl + "api/1/entity/search/all?sessionToken=" + json.token + "&limit=99999&offset=0")
        .expectHeaderContains('content-type', 'json')

    .expectJSONTypes({
        "params": {
            "offset": Number,
            "limit": Number,
            "parentEntityId": String,
            "keyword": String,
            // "includeAllFields": Boolean,
            "minDepth": Number,
            "maxDepth": Number

        },
    })

    .expectJSONTypes('results.*', {
        "objectId": Number,
        "entityId": String,
        "entityName": String,
        "companyRegistrationNumber": String,
        "registeredName": String,
        "taxRegistrationNumber": String,
        "childrenCount": Number

    })

    .afterJSON(function(json) {
            expect(json.total).toBe(49);
        })
        .expectStatus(200)
        .toss()


    /*===============================================================================================================
        ======================================== 7. Get entity fields Api ======================================================
        ===============================================================================================================*/
    // https://entity-api.cxanow.com/api/1/entity/fields?sessionToken={{sessionToken}}
    frisby.create('EntityTest - get entity fields api')
        .get(entityUrl + "api/1/entity/fields?sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')

    .expectJSONTypes('columns', {
        "name": String,
        "fields": Array

    })

    .expectJSONTypes('primary', {
        "name": String,
        "fields": Array

    })

    .expectJSONTypes('contact', {
            "name": String,
            "fields": Array

        })
        // .afterJSON(function(json) {
        //         expect(json.total).toBe(38);
        //     })
        .expectStatus(200)
        .toss()


    /*===============================================================================================================
        ---------------------------------------- 8. Get Child Entities ---------------------------------------------
        ===============================================================================================================*/
    frisby.create('EntityTest - Get child entity api')
        .get(entityUrl + "api/1/entity/CRM1117/child-entities?sessionToken=" + json.token + "&limit=99999&offset=0")
        .expectHeaderContains('content-type', 'json')
        .expectJSONTypes({
            "params": {
                "offset": Number,
                "limit": Number,
                "parentEntityId": String,
                // "includeAllFields": Boolean,
                "minDepth": Number,
                "maxDepth": Number


            },
        })

    .expectJSONTypes('results.*', {
        "objectId": Number,
        "entityId": String,
        "entityName": String,
        "companyRegistrationNumber": String,
        "registeredName": String,
        "taxRegistrationNumber": String,
        "parentEntityId": String,
        "childrenCount": Number
    })

    .afterJSON(function(json) {
            expect(json.total).toBe(0);
        })
        .expectStatus(200)
        .toss()

    //3.1 Valid Entity
    /* t = 1;
     frisby.create('Create a new entity')
         .post(entityUrl + "api/1/entity/create?sessionToken=" + res.token, {

             "status": "Pending",
             "effectiveDate": null,
             "value": {
                 "objectId": 0,
                 "entityName": "Fake Entity by st #39",
                 "companyRegistrationNumber": "SG-2015-05-231" + t,
                 "registeredName": "Fake Entity by samuel Pte Ltd #1",
                 "registeredInCountryCode": "SG",
                 "parentEntityId": "",
                 "groupName": "TestGroup",
                 "isParentEntityLogicalParent": false,
                 "taxRegistrationNumber": "NA",
                 "hasCheckedDowJonesWatchList": false,
                 "registrationCertificate": "",
                 "contacts": [{
                     "type": "client.billing.wellness",
                     "name": "Ricky Matias",
                     "position": "",
                     "phone1": "66598082",
                     "phone2": "",
                     "mobilePhone": "",
                     "fax": "",
                     "emailAddress": "samuel@cxagroup.com",
                     "address1": "1 Commonwealth Lane",
                     "address2": "#07-25 One Commonwealth",
                     "city": "Singapore",
                     "countryCode": "SG",
                     "postalCode": "149544"
                 }]
             }
         }, {
             json: true
         }, {
             headers: {
                 'Content-Type': 'application/json'
             }
         })
         .expectStatus(200).toss()*/

    //3.2 Accept valid objectId

    /* frisby.create('accept - a new entity')
         .post(entityUrl + "api/1/entity/accept?changeId=77&sessionToken=" + res.token)
     .expectStatus(200)
         .toss()*/

    //Accept Entity Change Request
    //3.3 Accept empty objectId

    frisby.create('EntityTest - accept - empty new entity')
        .post(entityUrl + "api/1/entity/accept?changeId&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.message).toMatch("Unknown");
        })
        .expectStatus(400)
        .toss()

    //3.4 Accept approved state.

    frisby.create('EntityTest - accept - already in an approved state')
        .post(entityUrl + "api/1/entity/accept?changeId=56&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.code).toEqual(500);
        })
        .expectStatus(400)
        .toss()

    //3.5 Decline Entity Change Request
    /* frisby.create('decline a new entity')
         .post(entityUrl + "api/1/entity/decline?changeId=61&sessionToken=" + json.token)
     .expectStatus(200)
         .toss()*/

    //3.6 Decline empty objectId

    frisby.create('EntityTest - Decline - empty new entity')
        .post(entityUrl + "api/1/entity/decline?changeId&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.message).toMatch("Unknown");
        })
        .expectStatus(400)
        .toss()

    //3.7 Decline approved state.

    frisby.create('EntityTest - Decline - already in an decline state')
        .post(entityUrl + "api/1/entity/decline?changeId=61&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.code).toEqual(500);
        })
        .expectStatus(400)
        .toss()

    /*===============================================================================================================
         ---------------------------------------- 10. Get All Entities Api ---------------------------------------------
        ===============================================================================================================*/

    frisby.create('EntityTest - Entity')
        .get(entityUrl + "api/1/entity?sessionToken=" + json.token + "&offset&limit&includeAllFields&includePending&includeDraft&userId&parentEntityId&keyword=Connexionsasia Pte Ltd&relatedTo&minDepth&maxDepth&entityIds=CRM503&groupName")
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')

    .expectJSONTypes({
        'params': {
            "offset": Number,
            "limit": Number,
            // "includeAllFields": Boolean,
            "minDepth": Number,
            "maxDepth": Number
        },
        'total': Number,

    })

    .expectJSONTypes('results.*', {
            "entityId": String,
            "entityName": String,
            "companyRegistrationNumber": String,
            "registeredName": String,
            "taxRegistrationNumber": String,
            "childrenCount": Number


        })
        //keyword test to match json results

    .afterJSON(function(json) {
            var a = 1;
            var jsonlength = json.total;
            /*var x = json.params.entityIds;*/

            //Count json value to test for max limit
            expect((json.params.entityIds).length).toBeLessThan(16);
            expect((json.params.keyword).length).toBeLessThan(25);

            expect(json.total).toEqual(a);
            expect(jsonlength).toEqual(1);
            expect(json.results[0].childrenCount).toEqual(0);
            expect(json.params.limit).toEqual(50)
            expect(json.params.keyword).toMatch("Connexionsasia Pte Ltd");
            expect(json.params.keyword).toMatch(json.results[0].entityName);
            expect(json.params.entityIds).toMatch(json.results[0].entityIds);


        })
        .toss()


    /*===============================================================================================================
        ---------------------------------------- 11. Bulk update entity group name ---------------------------------------------
        ===============================================================================================================*/
    /*frisby.create('EntityTest - Bulk Update Entity Group Name')
        .post(entityUrl + "api/1/entity/bulkUpdateGroupName?sessionToken=" + json.token, {

            "status": "Pending",
            "effectiveDate": null,
            "objectIdList": [1389, 1388, 1387, 1386, 1385],
            "groupName": "Test Update Group Name"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()*/

    //Update - empty change
    /*frisby.create('EntityTest - Update - empty change')
        .post(entityUrl + "api/1/entity/bulkupdategroupname?&sessionToken=" + json.token)
        .expectHeaderContains('content-type', 'json')
        .afterJSON(function(json) {
            expect(json.code).toEqual(500);
        })
        .expectStatus(400)
        .toss()*/

    /*===============================================================================================================
    ---------------------------------------- 12. Upload File ---------------------------------------------
    ===============================================================================================================*/

var fs = require('fs');
var path = require('path');
var FormData = require('form-data');
var logoPath = path.resolve(__dirname, '../spec/test.png');
var binaryData = [0xDE, 0xCA, 0xFB, 0xAD];
var form = new FormData();

form.append('file_1', fs.createReadStream(logoPath), {
    knownLength: fs.statSync(logoPath).size // we need to set the knownLength so we can call  form.getLengthSync()
});

    frisby.create('EntityTest - POST frisby ')
        .post(entityUrl + "api/1/entity/file/upload?inTempContainer&sessionToken=" + json.token, form, {
            json: false,
            headers: {
                'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
                'content-length': form.getLengthSync()
            }
        })
        .expectStatus(200)
        .toss()





};

console.log("TEST Under Entity API");

exports.EntityTest = EntityTest;
