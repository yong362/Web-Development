var frisby = require('frisby');
var authUrl = "http://cxa-dev-api.azurewebsites.net",
    authUrl2 = "http://cxa-dev-api.azurewebsites.net",
    permsApiKey = "aa0e389918034902bef25a63a5494af1441eec97e77143b3a2442b8be34028dd",
    actions = "[\"READ\",\"CREATE\",\"APPROVE\",\"DELETE\",\"UPDATE_BASIC\",\"UPDATE_CONTACTS\",\"UPDATE_BILLING\"]";
var fs = require('fs');
var path = require('path');
var FormData = require('form-data');
var logoPath = path.resolve(__dirname, '../spec/test.png');
var binaryData = [0xDE, 0xCA, 0xFB, 0xAD];
var form = new FormData();
var createUUID = function() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function encodeURIComponent(url) {

    return url;
}
form.append('file_1', fs.createReadStream(logoPath), {
    knownLength: fs.statSync(logoPath).size // we need to set the knownLength so we can call  form.getLengthSync()
});

var AuthTest = function() {
    frisby.create('AuthTest - brokerageConfig/:objectId')
        .get(authUrl2 + "brokerageConfig/1?includePending=true&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/create')
        .post(authUrl2 + "brokerageConfig/create?sessionToken=" + json.token, {
            name: "test" + createUUID(),
            groupName: "test"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/delete')
        .post(authUrl2 + "brokerageConfig/delete?objectId=9&sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/approved')
        .get(authUrl2 + "brokerageConfig/approved?agreementId&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/fields')
        .get(authUrl2 + "brokerageConfig/fields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/mine')
        .get(authUrl2 + "brokerageConfig/mine?includePending=true&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/myWebsiteConfig')
        .get(authUrl2 + "brokerageConfig/myWebsiteConfig?includePending=:includePending&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/pending')
        .get(authUrl2 + "brokerageConfig/pending?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    // frisby.create('AuthTest - brokerageConfig/file/upload ')
    //     .post(authUrl2 + "brokerageConfig/file/upload?inTempContainer=true&sessionToken=" + json.token, form, {
    //         json: false,
    //         headers: {
    //             'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
    //             'content-length': form.getLengthSync()
    //         }

    //     })
    //     .expectStatus(200)
    //     .afterJSON(function(json) {
    //         frisby.create('AuthTest - brokerageConfig/file/download')
    //             .get(json.url)
    //             .expectHeaderContains('Content-Type', 'application/octet-stream')
    //             .expectStatus(200)
    //             .toss()
    //     })
    //     .toss()
    frisby.create('AuthTest - brokerageConfig/update')
        .post(authUrl2 + "brokerageConfig/update?sessionToken=" + json.token, {
            groupName: "test1234",
            objectId: 1
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/accept')
        .post(authUrl2 + "brokerageConfig/accept?sessionToken=" + json.token, [1], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig/decline')
        .post(authUrl2 + "brokerageConfig/decline?sessionToken=" + json.token, [1], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - brokerageConfig?pendingState')
        .get(authUrl2 + "brokerageConfig?pendingState=pending&objectIds=[5930]&entityIds=[\"CRM504\", \"CRM503\"]&order=:order&offset=:offset&limit=:limit&keyword=:keyword&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        /****************************************End of brokerageConfig**************************************************************************/
    frisby.create('AuthTest - "config/forEntity')
        .get(authUrl2 + "config/forEntity/CRM504?includePending=false")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - config/summaryForEntity')
        .get(authUrl2 + "config/summaryForEntity/CRM504?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - config/supportForEntity')
        .get(authUrl2 + "config/supportForEntity/crm504?includePending=true")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        /****************************************End of Config**************************************************************************/

    frisby.create('AuthTest - flexConfig/employeeList ')
        .get(authUrl2 + "flexConfig/employeeList?flexConfigObjectId=1&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig/planFields')
        .get(authUrl2 + "flexConfig/planFields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig/spendingAccounts?flexConfigObjectId')
        .get(authUrl2 + "flexConfig/spendingAccounts?flexConfigObjectId=1&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest -flexConfig/:objectId ')
        .get(authUrl2 + "flexConfig/3")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig/create')
        .post(authUrl2 + "flexConfig/create?sessionToken=" + json.token, {
            name: "test3" + createUUID(),
            groupName: "test"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig/delete')
        .post(authUrl2 + "flexConfig/delete?objectId=9&sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest -flexConfig/approved')
        .get(authUrl2 + "flexConfig/approved?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig/fields')
        .get(authUrl2 + "flexConfig/fields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - flexConfig/mine')
        .get(authUrl2 + "flexConfig/mine?includePending=true&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig/myWebsiteConfig')
        .get(authUrl2 + "flexConfig/myWebsiteConfig?includePending=:includePending&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig/pending')
        .get(authUrl2 + "flexConfig/pending?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        // frisby.create('AuthTest - flexConfig/file/upload ')
        //     .post(authUrl2 + "flexConfig/file/upload?inTempContainer=true&sessionToken=" + json.token, form, {
        //         json: false,
        //         headers: {
        //             'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
        //             'content-length': form.getLengthSync()
        //         }

    //     })
    //     .expectStatus(200)

    // .afterJSON(function(json) {
    //         frisby.create('AuthTest - flexConfig/file/download')
    //             .get(json.url)
    //             .expectHeaderContains('Content-Type', 'application/octet-stream')
    //             .expectStatus(200)
    //             .toss()
    //     })
    //     .toss()
    frisby.create('AuthTest - flexConfig/update')
        .post(authUrl2 + "flexConfig/update?sessionToken=" + json.token, {
            groupName: "gggg",
            objectId: 2
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig/accept')
        .post(authUrl2 + "flexConfig/accept?sessionToken=" + json.token, [1], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - flexConfig/decline')
        .post(authUrl2 + "flexConfig/decline?sessionToken=" + json.token, [1], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - flexConfig?pendingState')
        .get(authUrl2 + "flexConfig?pendingState=:pendingState&objectIds=[5930]&entityIds=[\"CRM504\"]&order=:order&offset=:offset&limit=:limit&keyword=:keyword&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        /****************************************End of flexConfig**************************************************************************/
        // frisby.create('AuthTest - insuranceConfig/:objectId')
        //     .get(authUrl2 + "insuranceConfig/8?includePending=pending&sessionToken=" + json.token)
        //     .expectHeaderContains('Content-Type', 'json')
        //     .expectStatus(200)
        //     .toss()
        // frisby.create('AuthTest - insuranceConfig/create')
        //     .post(authUrl2 + "insuranceConfig/create?sessionToken=" + json.token, {
        //         name: "test3"+createUUID(),
        //         groupName: "test"
        //     }, {
        //         json: true
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })

    // .expectStatus(200)
    //     .toss()

    // frisby.create('AuthTest - insuranceConfig/delete')
    //     .post(authUrl2 + "insuranceConfig/delete?objectId=9&sessionToken=" + json.token, {

    //     }, {
    //         json: true
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .expectStatus(200)
    //     .toss()
    frisby.create('AuthTest - insuranceConfig/approved')
        .get(authUrl2 + "insuranceConfig/approved?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - insuranceConfig/fields')
        .get(authUrl2 + "insuranceConfig/fields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - insuranceConfig/mine')
        .get(authUrl2 + "insuranceConfig/mine?includePending=true&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - insuranceConfig/myWebsiteConfig')
        .get(authUrl2 + "insuranceConfig/myWebsiteConfig?includePending=:includePending&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - insuranceConfig/pending')
        .get(authUrl2 + "insuranceConfig/pending?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    // frisby.create('AuthTest - insuranceConfig/file/upload ')
    //     .post(authUrl2 + "insuranceConfig/file/upload?inTempContainer=true&sessionToken=" + json.token, form, {
    //         json: false,
    //         headers: {
    //             'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
    //             'content-length': form.getLengthSync()
    //         }

    //     })
    //     .expectStatus(200)
    //     .afterJSON(function(json) {
    //         frisby.create('AuthTest - insuranceConfig/file/download')
    //             .get(json.url)
    //             .expectHeaderContains('Content-Type', 'json')
    //             .expectStatus(200)
    //             .toss()
    //     })
    //     .toss()
        // frisby.create('AuthTest - insuranceConfig/update')
        //     .post(authUrl2 + "insuranceConfig/update?sessionToken=" + json.token, {
        //         groupName: "test2",
        //         objectId: 10
        //     }, {
        //         json: true
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     .expectStatus(200)
        //     .toss()
    frisby.create('AuthTest - insuranceConfig/accept')
        .post(authUrl2 + "insuranceConfig/accept?sessionToken=" + json.token, [], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - insuranceConfig/decline')
        .post(authUrl2 + "insuranceConfig/decline?sessionToken=" + json.token, [], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - insuranceConfig?pendingState')
        .get(authUrl2 + "insuranceConfig?pendingState=:pendingState&objectIds=[5930]&entityIds=[\"CRM504\"]&order=:order&offset=:offset&limit=:limit&keyword=:keyword&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        /****************************************End of insuranceConfig**************************************************************************/

    frisby.create('AuthTest - providerConfig/:objectId')
        .get(authUrl2 + "providerConfig/2?includePending=pending&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - providerConfig/create')
        .post(authUrl2 + "providerConfig/create?sessionToken=" + json.token, {
            name: "test" + createUUID(),
            groupName: "test"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - providerConfig/delete')
        .post(authUrl2 + "providerConfig/delete?objectId=3&sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - providerConfig/approved')
        .get(authUrl2 + "providerConfig/approved?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - providerConfig/fields')
        .get(authUrl2 + "providerConfig/fields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - providerConfig/mine')
        .get(authUrl2 + "providerConfig/mine?includePending=true&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - providerConfig/myWebsiteConfig')
        .get(authUrl2 + "providerConfig/myWebsiteConfig?includePending=:includePending&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - providerConfig/pending')
        .get(authUrl2 + "providerConfig/pending?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        // form.append('file_2', fs.createReadStream(logoPath), {
        //     knownLength: fs.statSync(logoPath).size // we need to set the knownLength so we can call  form.getLengthSync()
        // });
        // frisby.create('AuthTest - providerConfig/file/upload ')
        //     .post(authUrl2 + "providerConfig/file/upload?inTempContainer=true&sessionToken=" + json.token, form, {
        //         json: false,
        //         headers: {
        //             'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
        //             'content-length': form.getLengthSync()
        //         }

    //     })
    //     .expectStatus(200)
    //     .afterJSON(function(json) {
    //         frisby.create('AuthTest - providerConfig/file/download')
    //             .get(json.url)
    //             .expectHeaderContains('Content-Type', 'application/octet-stream')
    //             .expectStatus(200)
    //             .toss()
    //     })
    //     .toss()
    // frisby.create('AuthTest - providerConfig/update')
    //     .post(authUrl2 + "providerConfig/update?sessionToken=" + json.token, {
    //         name: "test123",
    //         objectId: 3
    //     }, {
    //         json: true
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .expectStatus(200)
    //     .toss()
    frisby.create('AuthTest - providerConfig/accept')
        .post(authUrl2 + "providerConfig/accept?sessionToken=" + json.token, [1], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - providerConfig/decline')
        .post(authUrl2 + "providerConfig/decline?sessionToken=" + json.token, [1], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - providerConfig?pendingState')
        .get(authUrl2 + "providerConfig?pendingState=:pendingState&objectIds=[5930]&entityIds=[\"CRM504\"]&order=:order&offset=:offset&limit=:limit&keyword=:keyword&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        /*************************************************End of providerConfig***********************************************************/
    frisby.create('AuthTest - security/group/:objectId')
        .get(authUrl2 + "security/group/3?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - security/group/create')
        .post(authUrl2 + "security/group/create?sessionToken=" + json.token, {
            name: "testtest" + createUUID()
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - security/group(filter)')
        .get(authUrl2 + "security/group?offset=10&limit=10&keyword=test&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - security/group/update')
        .post(authUrl2 + "security/group/update?sessionToken=" + json.token, {
            "permissions": [{
                "actions": [{
                    "isEnabled": false,
                    "objectId": "read"
                }],
                "objectId": "employee"
            }],
            "objectId": 10061
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - security/group/delete')
        .post(authUrl2 + "/security/group/delete?objectId=10060&sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - security/permission/check')
        .get(authUrl2 + "security/permission/check?resource=employee&action=read&entities=CRM59&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - security/permission/entities')
        .get(authUrl2 + "security/permission/entities?resource=employee&action=read&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - security/permission/meta')
        .get(authUrl2 + "security/permission/meta")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest -security/fields')
        .get(authUrl2 + "security/fields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - security/entity/addChild')
        .post(authUrl2 + "security/entity/addChild?sessionToken=" + json.token, {
            "EntityId": 'CRM1036',
            "OwnerId": 'CRM504'
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
        /*************************************************End of security***********************************************************/
    frisby.create('AuthTest - user/setLocale')
        .post(authUrl2 + "user/setLocale?sessionToken=" + json.token, {
            "locale":"en"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
        // frisby.create('AuthTest - user/password/change')
        //     .post(authUrl2 + "user/password/change?sessionToken=" + json.token, {
        //         clientName: "panbroker",
        //         newPassword: "P@ssw0rd",
        //         oldPassword: "just1n"
        //     }, {
        //         json: true
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     .expectStatus(200)
        //     .toss()
    frisby.create('AuthTest - user/login')
        .post(authUrl2 + "user/login", {
            "userName": "root",
            "clientName": "root",
            "password": "P@ssw0rd",
            "locale": "en"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest -    user/logout')
        .post(authUrl2 + "user/logout", {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - user/welcome')
        .get(authUrl2 + "user/welcome?objectId=5931&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - user/welcome-multiple')
        .post(authUrl2 + "user/welcome-multiple?sessionToken=" + json.token, [5930, 5931], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
        /************************************************* End of user ***********************************************************/
    frisby.create('AuthTest - websiteConfig/:objectId')
        .get(authUrl2 + "websiteConfig/1?includePending=pending&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - websiteConfig/create')
        .post(authUrl2 + "websiteConfig/create?sessionToken=" + json.token, {
            "name": "test" + createUUID(),
            "groupName": "test",
            "portal": "employee",
            "theme": "2015-07"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - websiteConfig/delete')
        .post(authUrl2 + "websiteConfig/delete?objectId=3&sessionToken=" + json.token, {

        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - websiteConfig/approved')
        .get(authUrl2 + "websiteConfig/approved?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - websiteConfig/fields')
        .get(authUrl2 + "websiteConfig/fields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - websiteConfig/mine')
        .get(authUrl2 + "websiteConfig/mine?includePending=true&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - websiteConfig/myWebsiteConfig')
        .get(authUrl2 + "websiteConfig/myWebsiteConfig?includePending=:includePending&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - websiteConfig/pending')
        .get(authUrl2 + "websiteConfig/pending?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    // frisby.create('AuthTest - websiteConfig/file/upload ')
    //     .post(authUrl2 + "websiteConfig/file/upload?inTempContainer=true&sessionToken=" + json.token, form, {
    //         json: false,
    //         headers: {
    //             'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
    //             'content-length': form.getLengthSync()
    //         }

    //     })
    //     .expectStatus(200)
    //     .afterJSON(function(json) {
    //         frisby.create('AuthTest - websiteConfig/file/download')
    //             .get(json.url)
    //             .expectHeaderContains('Content-Type', 'application/octet-stream')
    //             .expectStatus(200)
    //             .toss()
    //     })
    //     .toss()
        // frisby.create('AuthTest - websiteConfig/update')
        //     .post(authUrl2 + "websiteConfig/update?sessionToken=" + json.token, {
        //         name: "test123",
        //         objectId: 3
        //     }, {
        //         json: true
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     .expectStatus(200)
        //     .toss()
    frisby.create('AuthTest - websiteConfig/accept')
        .post(authUrl2 + "websiteConfig/accept?sessionToken=" + json.token, [1], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - websiteConfig/decline')
        .post(authUrl2 + "websiteConfig/decline?sessionToken=" + json.token, [1], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - websiteConfig/find')
        .get(authUrl2 + "websiteConfig/find?clientName=cxaportal&currentLocale=en")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - websiteConfig?pendingState')
        .get(authUrl2 + "websiteConfig?pendingState=:pendingState&objectIds=[5930]&entityIds=[\"CRM504 \"]&order=:order&offset=:offset&limit=:limit&keyword=:keyword&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        /************************************************* End of websiteConfig ***********************************************************/
        // frisby.create('AuthTest - wellnessConfig/:objectId')
        //     .get(authUrl2 + "wellnessConfig/8?includePending=pending&sessionToken=" + json.token)
        //     .expectHeaderContains('Content-Type', 'json')
        //     .expectStatus(200)
        //     .toss()
        // frisby.create('AuthTest - wellnessConfig/create')
        //     .post(authUrl2 + "wellnessConfig/create?sessionToken=" + json.token, {
        //         name: "test3",
        //         groupName: "test"
        //     }, {
        //         json: true
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })

    // .expectStatus(200)
    //     .toss()
    // frisby.create('AuthTest - wellnessConfig/delete')
    //     .post(authUrl2 + "wellnessConfig/delete?objectId=9&sessionToken=" + json.token, {

    //     }, {
    //         json: true
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .expectStatus(200)
    //     .toss()
    frisby.create('AuthTest - wellnessConfig/approved')
        .get(authUrl2 + "wellnessConfig/approved?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()

    frisby.create('AuthTest - wellnessConfig/fields')
        .get(authUrl2 + "wellnessConfig/fields")
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - wellnessConfig/mine')
        .get(authUrl2 + "wellnessConfig/mine?includePending=true&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - wellnessConfig/myWebsiteConfig')
        .get(authUrl2 + "wellnessConfig/myWebsiteConfig?includePending=:includePending&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('AuthTest - wellnessConfig/pending')
        .get(authUrl2 + "wellnessConfig/pending?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        // form.append('file_2', fs.createReadStream(logoPath), {
        //     knownLength: fs.statSync(logoPath).size // we need to set the knownLength so we can call  form.getLengthSync()
        // });
        // frisby.create('AuthTest - wellnessConfig/file/upload ')
        //     .post(authUrl2 + "wellnessConfig/file/upload?inTempContainer=true&sessionToken=" + json.token, form, {
        //         json: false,
        //         headers: {
        //             'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
        //             'content-length': form.getLengthSync()
        //         }

    //     })
    //     .expectStatus(200)
    //     .afterJSON(function(json) {
    //         frisby.create('AuthTest - wellnessConfig/file/download')
    //             .get(json.url)
    //             .expectHeaderContains('Content-Type', 'application/octet-stream')
    //             .expectStatus(200)
    //             .toss()
    //     })
    //     .toss()
    // frisby.create('AuthTest - wellnessConfig/update')
    //     .post(authUrl2 + "wellnessConfig/update?sessionToken=" + json.token, {
    //         groupName: "test2",
    //         objectId: 10
    //     }, {
    //         json: true
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .expectStatus(200)
    //     .toss()
    // frisby.create('AuthTest - wellnessConfig/accept')
    //     .post(authUrl2 + "wellnessConfig/accept?sessionToken=" + json.token, [], {
    //         json: true
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .expectStatus(200)
    //     .toss()
    // frisby.create('AuthTest - wellnessConfig/decline')
    //     .post(authUrl2 + "wellnessConfig/decline?sessionToken=" + json.token, [], {
    //         json: true
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .expectStatus(200)
    //     .toss()

    frisby.create('AuthTest - wellnessConfig?pendingState')
        .get(authUrl2 + "wellnessConfig?pendingState=pending&objectIds=[5930]&entityIds=[\"CRM504\"]&order=:order&offset=:offset&limit=:limit&keyword=:keyword&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        /************************************************* End of wellnessConfig ***********************************************************/
};
exports.AuthTest = AuthTest;
