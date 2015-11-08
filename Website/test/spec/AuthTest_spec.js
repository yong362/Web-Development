/*========================================================================================================================
==========================================API STRESSING ===================================================================
==========================================================================================================================*/
// var benchrest = require('bench-rest');
// var flow = "https://auth.cxanow.com/api/1/user/login";
//  // var flow = {
//  //    main: [
//  //      { post: 'https://auth.cxanow.com/api/1/websiteConfig/find?clientName=cxal&currentLocale=en', json: 'true' },
//  //      { get: "https://auth.cxanow.com/api/1/websiteConfig?sessionToken=cBFHTM2MR0-8L54mgcPKLw" }
//  //    ]
//  //  };

//   // if the above flow will be used with the command line runner or
//   // programmatically from a separate file then export it.
//   module.exports = flow;

//   // There are even more flow options like setup and teardown, see detailed usage

//   var runOptions = {
//     limit: 100,     // concurrent connections
//     iterations: 1000  // number of iterations to perform
//   };
//   benchrest(flow, runOptions)
//     .on('error', function (err, ctxName) { console.error('Failed in %s with err: ', ctxName, err); })
//     .on('end', function (stats, errorCount) {
//       console.log('error count: ', errorCount);
//       console.log('stats', stats);
//     });
/*========================================================================================================================
========================================== API TESTING ===================================================================
==========================================================================================================================*/
var frisby = require('frisby');
var authUrl = "https://auth.cxademo.com/",
    authUrl2 = "https://auth.cxanow.com/",
    permsApiKey = "aa0e389918034902bef25a63a5494af1441eec97e77143b3a2442b8be34028dd",
    actions = "[\"READ\",\"CREATE\",\"APPROVE\",\"DELETE\",\"UPDATE_BASIC\",\"UPDATE_CONTACTS\",\"UPDATE_BILLING\"]";

function encodeURIComponent(url) {

        return url;
    }
    /*=======================Directory========================
    1.0 Invalid Token && Expire Token Testing
    2.1 POST LOGIN API
    2.2 Getting sessionToken
    3.0 GET API
    4.0 ClientName & locale
    5.0 Pending API
    6.1 Permission API
    6.2 All permissionUser 
    6.3 check for any permission
    6.4 CHECK FOR ALL PERMISSION
    7.1 Create API
    7.2 ACCEPT API
    7.3 Decline API
    7.4 UPDATE API
    8.1 Permission Group
    8.2 Permission api secgrp
    8.3 permission by user
    9.1 DELETE Permission sec-grp
    9.2 Delete sec grp API
    10.1 Add Legal Entity API
    10.2 Delete Legal Entity API
    11.2 Create permission API
    12.1 Add User API
    12.2 Remove User API
    ===============End Of Directory========================*/
var AuthTest = function() {
    // console.log("TEST Under Auth API");
    /*========================================================================================================================
    ========================================== 1.Invalid Token && Expire Token Testing =======================================
    ==========================================================================================================================*/

    frisby.create('Should not allow access with invalid token')
        .get(authUrl2 + "api/1/websiteConfig?sessionToken=jGMGbipz70mhIPiQPH53Eg")
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(402);
        })
        .toss();

    frisby.create('Should not allow access with No token')
        .get(authUrl2 + "api/1/websiteConfig?sessionToken")
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(402);
            expect(json.message).toEqual('No authentication token found.');
        })
        .toss();
    // /*========================================================================================================================
    // ========================================== 2.1 POST LOGIN API ============================================================
    // ==========================================================================================================================*/
    frisby.create('POST login details without clientName')
        .post(authUrl2 + 'api/1/user/login', {
            "userName": "justin",
            "password": "just1n",
            "locale": "en"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(406);
            expect(json.message).toEqual('client name can\'t be null or empty')
        })
        .toss()
    frisby.create('POST login details without password')
        .post(authUrl2 + 'api/1/user/login', {
            "userName": "justin",
            "clientName": "sg-flex",
            "locale": "en"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(406);
            expect(json.message).toEqual('password can\'t be null or empty')
        })
        .toss()
    frisby.create('POST login details with wrong password')
        .post(authUrl2 + 'api/1/user/login', {
            "userName": "justin",
            "clientName": "sg-flex",
            "password": "justin",
            "locale": "en"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
            expect(json.message).toEqual('Unknown')
        })
        .toss()
    /*========================================================================================================================
    ==========================================2.2 Getting sessionToken========================================================
    ==========================================================================================================================*/
    // frisby.create('POST login details')
 //     .post(authUrl2 + 'api/1/user/login', {
 //         "userName": "justin",
 //         "clientName": "sg-flex",
 //         "password": "just1n",
 //         "locale": "en"
 //     }, {
 //         json: true
 //     }, {
 //         headers: {
 //             'Content-Type': 'application/json'
 //         }
 //     })
 //     .expectStatus(200)
 //     .expectHeader('Content-Type', 'application/json; charset=utf-8')
 //     .expectJSONTypes({
 //         token: String
 //     })
 //     .afterJSON(function(res) {
 //             /* include auth token in the header of all future requests */
 //             frisby.globalSetup({
 //                 request: {
 //                     headers: {
 //                         'sessionToken': res.token
 //                     }
 //                 }
 //             });


    /*========================================================================================================================
    ==========================================3.0 GET API=====================================================================
    ==========================================================================================================================*/
    frisby.create('AuthTest - Get Webconfig')
        .get(authUrl2 + "api/1/websiteConfig?sessionToken=" + json.token)
        .expectHeader('Content-Type', 'application/json; charset=utf-8')

    .expectStatus(200)
        .expectJSONTypes('results.*', {
            clientName: String,
            portal: String,
            theme: String,
            objectId: Number,
            status: String,
            entities: Array,
            name: String
        })
        .toss()

    frisby.create('AuthTest - Webconfig/approved')
        .get(authUrl2 + "api/1/websiteConfig/approved?agreementId=2&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - Webconfig/fields')
        .get(authUrl2 + "api/1/websiteConfig/fields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()


    /*========================================================================================================================
    ==========================================4.ClientName & locale===========================================================
    ==========================================================================================================================*/
    frisby.create('AuthTest - Webconfig/find')
        .get(authUrl2 + "api/1/websiteConfig/find?clientName=cxaportal&currentLocale=en")
        .expectHeaderContains('Content-Type', 'json')
        .expectJSONTypes({
            'clientName': String,
            'isOldFlex': Boolean,
            'portal': String,
            'theme': String,
            'locale': String

        })
        .afterJSON(function() {
            expect(json.clientName).toEqual('cxaportal');
            expect(json.isOldFlex).toEqual(true);
            expect(json.portal).toEqual('broker');
            expect(json.theme).toEqual('2015-01');
            expect(json.locale).toEqual('en');

        })
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - Webconfig/find Invalid clientName')
        .get(authUrl2 + "api/1/websiteConfig/find?clientName=cxal&currentLocale=en")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(404);
            expect(json.message).toEqual('No config for client [cxal] found.');
        })
        .toss()
    frisby.create('AuthTest- Webconfig/find No Input')
        .get(authUrl2 + "api/1/websiteConfig/find?clientName&currentLocale=en")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
            expect(json.message).toEqual('Unknown');
        })
        .toss()


    /*========================================================================================================================
    ==========================================5. Pending API==================================================================
    ==========================================================================================================================*/

    frisby.create('AuthTest - Webconfig/pending')
        .get(authUrl2 + "api/1/websiteConfig/pending?agreementId=2&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - websiteConfig?includePending')
        .get(authUrl2 + "api/1/websiteConfig?includePending=true&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()


    frisby.create('AuthTest - Webconfig?includePending No boolean')
        .get(authUrl2 + "api/1/websiteConfig?includePending=&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        frisby.create('permissionAny api')
            .get(authUrl + "api/1/websiteConfig?includePending=true&sessionToken="+sessionToken)
            .expectStatus(200)
            .toss()
        frisby.create('permissionAll api')
            .get(authUrl + "api/1/websiteConfig?includePending=true&sessionToken="+sessionToken)
            .expectStatus(200)
            .toss()

    /*=========================================================================================================================
     =========================================6.1 Permission API=================================================================
     =========================================================================================================================*/
    frisby.create('AuthTest - permissionMeta api')
        .get(authUrl2 + "api/1/permissions/meta")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .expectJSONTypes('*', {
            'name': String,
            'actions': Array,
            'description': String
        })
        .toss()

    /*=========================================================================================================================
     =======================================6.2 All permission User ==========================================================
     =========================================================================================================================*/
    frisby.create('AuthTest - permissions User All api')
        .get(authUrl2 + "api/1/permissions/user/superadmin?permsApiKey=" + permsApiKey)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .expectJSONTypes({
            'params': {
                'permsApiKey': String,
                'offset': String,
                'limit': String,
                'includeDraft': String,
                'includePending': String,
                'includeApproved': String,
                'includeRejected': String,
            },
            'total': Number,
            'results': Array
        })
        .afterJSON(function() {
            expect(json.params.permsApiKey).toEqual(permsApiKey);
            expect(json.params.offset).toEqual('0');
            expect(json.params.limit).toEqual('100');
            expect(json.params.includeDraft).toEqual('False');
            expect(json.params.includePending).toEqual('False');
            expect(json.params.includeApproved).toEqual('False');
            expect(json.params.includeRejected).toEqual('False');

        })
        .toss()
    frisby.create('AuthTest - Invalid API KEY ')
        .get(authUrl2 + "api/1/permissions/user/superadmin?permsApiKey=a" + permsApiKey)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(400)
        .toss()
    frisby.create('AuthTest - NO user')
        .get(authUrl2 + "api/1/permissions/user/?permsApiKey=" + permsApiKey)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(404);
            expect(json.message).toEqual('api/1/permissions/user/');
        })
        .toss()

    /*=========================================================================================================================
     =======================================6.3 check for any permission=======================================================
     =========================================================================================================================*/
    //
        //======================================================//

    /*========================================================================================================================
    =======================================7.1 Create API=======================================================================
    =========================================================================================================================*/
    frisby.create('AuthTest - Create api')
        .post(authUrl2 + "/api/1/websiteConfig/create?sessionToken=" + json.token, {
            "name": "uniqueName",
            "clientName": 'uniqueClientName',
            "portal": "employee",
            "theme": "2015-01"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - Create api with no value')
        .post(authUrl2 + "/api/1/websiteConfig/create?sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(406);
            expect(json.message).toEqual('name is required');
        })
        .toss()
    frisby.create('AuthTest - Create api with only name')
        .post(authUrl2 + "/api/1/websiteConfig/create?sessionToken=" + json.token, {
            "name": "hjh"

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(402);
            expect(json.message).toEqual('clientName is required');
        })
        .toss()

    frisby.create('AuthTest - Create api No Permission')
        .post(authUrl2 + "/api/1/websiteConfig/create?sessionToken=" + json.token, {
            "name": "uniqueName",
            "clientName": 'uniqueClientName',
            "portal": "employee",
            "theme": "2015-01"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        // .afterJSON(function() {
        //     expect(json.code).toEqual(401);
        //     expect(json.message).toEqual('Not allowed to modify website config');
        // })
        .toss()
            /*========================================================================================================================
            =======================================7.2 ACCEPT API====================================================================
            =========================================================================================================================*/
        frisby.create('ACCEPT API approved state')
            .post(authUrl2 + "api/1/websiteConfig/accept?sessionToken=" + json.token, {
                'objectId': 20
            }, {
                json: true
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .expectStatus(400)
            .afterJSON(function() {
                expect(json.code).toEqual(500);
            })
            .toss()

    frisby.create('ACCEPT API no input')
        .post(authUrl2 + "api/1/websiteConfig/accept?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
        })
        .toss()
    frisby.create('ACCEPT API No Permission')
        .post(authUrl2 + "api/1/websiteConfig/accept?sessionToken=" + json.token, {
            'objectId': 20
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(401);
            expect(json.message).toEqual('Not allowed to approve/reject website config');
        })
        .toss()
        // ========================================================================================================================
        // =======================================7.3 Decline API====================================================================
        // =========================================================================================================================
        frisby.create('Decline API Cant approve a change in an approved state')
            .post(authUrl2 + "api/1/websiteConfig/decline?sessionToken=" + json.token, {
                'objectId': 20
            }, {
                json: true
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .expectStatus(400)
            .afterJSON(function() {
                expect(json.code).toEqual(500);
            })
            .toss()

    frisby.create('Decline API no input')
        .post(authUrl2 + "api/1/websiteConfig/decline?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
        })
    //     .toss()
    frisby.create('Decline API No Permission')
        .post(authUrl2 + "api/1/websiteConfig/decline?sessionToken=" + json.token, {
            'objectId': 20
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(401);
            expect(json.message).toEqual('Not allowed to approve/reject website config');
        })
        .toss()
        // ========================================================================================================================
        // =======================================7.4 UPDATE API=====================================================================
        // =========================================================================================================================
        frisby.create('AuthTest - UPDATE API')
            .post(authUrl2 + "api/1/websiteConfig/update?objectId=2&sessionToken=" + json.token, {
                "clientName": "hi",
                "portal": "Employee",
                "theme": "2015-01",
                "status": "active",
                "name": "sam",
                "entities": []
            }, {
                json: true
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .expectStatus(200)
            .toss()

    frisby.create('AuthTest - UPDATE API objectId = 0')
        .post(authUrl2 + "api/1/websiteConfig/update?objectId=0&sessionToken=" + json.token, {
            "clientName": "hi",
            "portal": "Employee",
            "theme": "2015-01",
            "status": "active",
            "name": "sam",
            "entities": []
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
            expect(json.message).toEqual('Unknown');
        })
        .toss()
    frisby.create('AuthTest - UPDATE API No objectId')
        .post(authUrl2 + "api/1/websiteConfig/update?objectId&sessionToken=" + json.token, {
            "clientName": "hi",
            "portal": "Employee",
            "theme": "2015-01",
            "status": "active",
            "name": "sam",
            "entities": []
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.message).toEqual('The request is invalid.');
        })
        .toss()
    frisby.create('AuthTest - UPDATE API No value')
        .post(authUrl2 + "api/1/websiteConfig/update?objectId=2&sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
            expect(json.message).toEqual('Unknown');
        })
        .toss()
    frisby.create('AuthTest - UPDATE API No Name insert')
        .post(authUrl2 + "api/1/websiteConfig/update?objectId=2&sessionToken=" + json.token, {
            "clientName": "hi",
            "portal": "Employee",
            "theme": "2015-01",
            "status": "active",
            "entities": []

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
            expect(json.message).toEqual('Unknown');
        })
        .toss()
    frisby.create('AuthTest - UPDATE API No Permission')
        .post(authUrl2 + "api/1/websiteConfig/update?objectId=2&sessionToken=" + json.token, {
            "clientName": "hi",
            "portal": "Employee",
            "theme": "2015-01",
            "status": "active",
            "name": "sam",
            "entities": []
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        // .afterJSON(function() {
        //     expect(json.code).toEqual(401);
        //     expect(json.message).toEqual('Not allowed to modify website config');
        // })
        .toss()

    //     /*========================================================================================================================
    //     =======================================8.1 Create Permission sec_grp===============================================================
    //     =========================================================================================================================*/
    frisby.create('Create Permission sec-grp api NO PERMISSION')
        .post(authUrl2 + "api/1/permissions/security-group?sessionToken=" + json.token, {
            "legalEntityId": "CRM123",
            "securityGroupName": "DIMS_ALEX"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage security groups for legal entity ID [CRM123].');
        })
        .toss()
    frisby.create('Create Permission sec-grp api invalid token')
        .post(authUrl2 + "api/1/permissions/security-group?sessionToken=a" + json.token, {
            "legalEntityId": "CRM123",
            "securityGroupName": "DIMS_ALEX"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(402);
            expect(json.message).toEqual('Session has expired');
        })
        .toss()
        frisby.create('Permission sec-grp api No value')
            .post(authUrl2 + "api/1/permissions/security-group?sessionToken=" + json.token,{

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json).toEqual('Legal entity ID can\'t be null or empty');
        })
        .toss()

    /*========================================================================================================================
    =======================================8.2 Create Permission api ==========================================================
    =========================================================================================================================*/
    frisby.create('Create Permission api group does not exist')
        .post(authUrl2 + "/api/1/permissions/security-group/1/permission?sessionToken=" + json.token, {
            "actions": ["READ"],
            "resource": "employeeCensus"

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Security group does not exist');
        })
        .toss()
    frisby.create('Create Permission api No permission')
        .post(authUrl2 + "/api/1/permissions/security-group/9/permission?sessionToken=" + json.token, {
            "actions": ["READ"],
            "resource": "employeeCensus"

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage permissions for security group ID [9].');
        })
        .toss()
        /*========================================================================================================================
        =======================================8.3 permission by user=============================================================
        =========================================================================================================================*/
        frisby.create('Permission sec-grp by user api No Permission')
            .post(authUrl2 + "api/1/permissions/security-group/9/user/justin%40sg-flex?sessionToken=" + json.token, {}, {
                json: true
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .expectStatus(403)
            .afterJSON(function() {
                expect(json.result).toEqual('FAILED');
                expect(json.reason).toEqual('Not allowed to manage users for security group ID [9].');
            })
            .toss()

    /*========================================================================================================================
    =======================================9.1 Create sec grp API=============================================================
    =========================================================================================================================*/
    frisby.create('Create sec grp API No Permission')
        .post(authUrl2 + "api/1/permissions/security-group?sessionToken=" + json.token, {
            "securityGroupName": "DIMS",
            "legalEntityId": "CRM503",

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage security groups for legal entity ID [CRM503].');
        })
        .toss()
    frisby.create('Create Permission sec-grp api invalid token')
        .post(authUrl2 + "api/1/permissions/security-group?sessionToken=a" + json.token, {
            "legalEntityId": "CRM123",
            "securityGroupName": "DIMS_ALEX"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(402);
            expect(json.message).toEqual('Session has expired');
        })
        .toss()
        /*========================================================================================================================
        =======================================9.2 Delete sec grp API=============================================================
        =========================================================================================================================*/
    frisby.create('Delete sec grp API No Permission')
        .delete(authUrl2 + "/api/1/permissions/security-group/9?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage security groups for legal entity ID [CRM503].');
        })
        .toss()
        /*========================================================================================================================
         =======================================10.1 Add Legal Entity API=========================================================
         =========================================================================================================================*/
    frisby.create('Add Legal Entity API No Permission')
        .post(authUrl2 + "/api/1/permissions/security-group/9/entity/REPO1392?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage legal entities for security group ID [9].');
        })
        .toss()
        /*========================================================================================================================
        =======================================10.2 Delete Legal Entity API=======================================================
        =========================================================================================================================*/
    frisby.create('Delete Legal Entity API No Permission')
        .delete(authUrl2 + "api/1/permissions/security-group/9/entity/CRM503?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage legal entities for security group ID [9].');
        })
        .toss()
        /*========================================================================================================================
        =======================================11.1 Create permission API=========================================================
        =========================================================================================================================*/
    frisby.create('Create permission API')
        .post(authUrl2 + "/api/1/permissions/security-group/9/permission?sessionToken=" + json.token, {
            "actions": ["READ"],
            "resource": "conf.brokerage"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage permissions for security group ID [9].');
        })
        .toss()
    frisby.create('Create permission API Invalid sec-grp')
        .post(authUrl2 + "api/1/permissions/security-group/1/permission?sessionToken=" + json.token, {
            "actions": ["READ"],
            "resource": "conf.brokerage"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Security group does not exist');
        })
        .toss()
    frisby.create('Create permission API No Value')
        .post(authUrl2 + "api/1/permissions/security-group/1/permission?sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Security group does not exist');
        })
        .toss()
    frisby.create('Create Permission api No permission')
        .post(authUrl2 + "/api/1/permissions/security-group/9/permission?sessionToken=" + json.token, {
            "actions": ["READ"],
            "resource": "employeeCensus"

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage permissions for security group ID [9].');
        })
        .toss()
        /*========================================================================================================================
        =======================================11.2 Revoke permission API=========================================================
        =========================================================================================================================*/
    frisby.create('Revoke permission API No Permission')
        .delete(authUrl2 + "api/1/permissions/security-group/9/permission/2?sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage permissions for security group ID [9].');
        })
        .toss()
    frisby.create('Revoke permission API Invalid sec-grp')
        .delete(authUrl2 + "api/1/permissions/security-group/1/user/justin%40sg-flex?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Security group does not exist');
        })
        .toss()
        /*========================================================================================================================
        =======================================12.1 Add User API==================================================================
        =========================================================================================================================*/
    frisby.create('Add User API No Permission')
        .post(authUrl2 + "api/1/permissions/security-group/9/user/justin%40sg-flex?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage users for security group ID [9].');
        })
        .toss()
    frisby.create('Add User API Invalid sec-grp')
        .post(authUrl2 + "api/1/permissions/security-group/1/user/justin%40sg-flex?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Security group does not exist');
        })
        .toss()
        /*========================================================================================================================
         =======================================12.2 Remove User API==============================================================
         =========================================================================================================================*/
    frisby.create('Remove User API No Permission')
        .delete(authUrl2 + "api/1/permissions/security-group/9/user/justin%40sg-flex?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(403)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Not allowed to manage users for security group ID [9].');
        })
        .toss()
    frisby.create('Remove User API Invalid sec-grp')
        .delete(authUrl2 + "api/1/permissions/security-group/1/user/justin%40sg-flex?sessionToken=" + json.token, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.result).toEqual('FAILED');
            expect(json.reason).toEqual('Security group does not exist');
        })
        .toss()

    /*========================================================================================================================
     =======================================13.1 Change Password API==========================================================
     =========================================================================================================================*/
    frisby.create('AuthTest - Change Password')
        .post(authUrl2 + "api/1/user/password/change?sessionToken=" + json.token, {
            "clientName": "sg-flex",
            "userName": "justin",
            "oldPassword": "password",
            "newPassword": "p"

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
            expect(json.message).toEqual('Unknown');
        })
        .toss()

    frisby.create('AuthTest - Change Password API No input')
        .post(authUrl2 + "api/1/user/password/change?sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(406);
            expect(json.message).toEqual('new and old passwords must be provided and can\'t be null or empty');
        })
        .toss()

    frisby.create('AuthTest - Change Password API Same old and new password')
        .post(authUrl2 + "api/1/user/password/change?sessionToken=" + json.token, {
            "clientName": "sg-flex",
            "userName": "justin",
            "oldPassword": "password",
            "newPassword": "password"

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(406);
            expect(json.message).toEqual('old and new passwords can\'t be the same');
        })
        .toss()
    frisby.create('AuthTest - Change Password API Missing of certain fields')
        .post(authUrl2 + "api/1/user/password/change?sessionToken=" + json.token, {

            "userName": "justin",
            "oldPassword": "just1n",
            "newPassword": "P@ssw0rd"

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
            expect(json.message).toEqual('"Your current password is not valid."');
        })
        .toss()
        /*========================================================================================================================
        =======================================13.2 Complete Reset Password API===================================================
        =========================================================================================================================*/
    frisby.create('AuthTest - Complete Reset Password API Invalid resetPasswordToken')
        .post(authUrl2 + "api/1/user/password/complete-reset", {
            "domainId": "sg-flex",
            "newPassword": "{{password}}",
            "resetPasswordToken": "9c321f4a92ff47528c109560624fb349b48f515be7164974b1f6e0d45a7c8aa6"

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(406);
            expect(json.message).toEqual('Client name can\'t be null or empty');
        })
        .toss()
        /*========================================================================================================================
        =======================================13.3 Initiate Reset Password API===================================================
        =========================================================================================================================*/
    frisby.create('AuthTest - Initiate Reset Password API')
        .post(authUrl2 + "api/1/user/password/initiate-reset", {
            "clientName": "sg-flex",
            "userName": "{{username}}",
            "dateOfBirth": "1980-01-01T00:00Z"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .toss()

    frisby.create('AuthTest - Complete Reset Password API No clientName')
        .post(authUrl2 + "api/1/user/password/initiate-reset", {
            "userName": "{{username}}",
            "dateOfBirth": "1980-01-01T00:00Z"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(500);
            expect(json.message).toEqual('Unknown');
        })
        .toss()

    frisby.create('AuthTest - Complete Reset Password API Invalid clientName')
        .post(authUrl2 + "api/1/user/password/initiate-reset", {
            "clientName": "sg-ex",
            "userName": "{{username}}",
            "dateOfBirth": "1980-01-01T00:00Z"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(400)
        .afterJSON(function() {
            expect(json.code).toEqual(401);
            expect(json.message).toEqual('Invalid credentials provided');
        })
    .toss()

    // })
    // .toss();

};
exports.AuthTest = AuthTest;
