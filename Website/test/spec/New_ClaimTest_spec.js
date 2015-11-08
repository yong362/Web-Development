var frisby = require('frisby');
var claimsUrl = "http://cxa-dev-api.azurewebsites.net",
    claimsUrl2 = "http://cxa-dev-api.azurewebsites.net";
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

var ClaimTest = function() {
    frisby.create('ClaimTest - Claim- Get')
        .get(claimsUrl2 + "claim/broker/234?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- GetList')
        .get(claimsUrl2 + "claim/broker/list?category=ins&view=all&pageSize=10&pageNumber=1&sort&order&keyword&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- GetList(related)')
        .get(claimsUrl2 + "claim/broker/list?category=ins&view=all&pageSize=10&pageNumber=1&sort&order&keyword&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- Download')
        .get(claimsUrl2 + "claim/broker/download?category=ins&view=all&pageSize=10&pageNumber=1&sort&order&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'text/plain')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- GetList(ChangeLog)')
        .get(claimsUrl2 + "claim/broker/141/log?pageSize=15&pageNumber=1&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- GetList(RequestedDocs)')
        .get(claimsUrl2 + "claim/broker/180/documents?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- GetTransactions')
        .get(claimsUrl2 + "claim/broker/transactions?view=pending&employeeId=3912&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- Split')
        .post(claimsUrl2 + "claim/broker/split?sessionToken=" + json.token, {
            "ClaimId": "139",
            "TargetClaimId": "140",
            "Note": "Test split 333333"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- Merge')
        .post(claimsUrl2 + "claim/broker/merge?sessionToken=" + json.token, {
            "ClaimId": "180",
            "TargetClaimId": "181",
            "Note": "linked - Merged test"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- RequestDocs')
        .post(claimsUrl2 + "claim/broker/requestdocs?sessionToken=" + json.token, {
            "claimId": "180",
            "requestedDocuments": [{
                "requestedDocumentId": 2,
                "isPending": true
            }, {
                "requestedDocumentId": 3,
                "isPending": true
            }, {
                "requestedDocumentId": 2,
                "isPending": true
            }, {
                "requestedDocumentId": 11,
                "isPending": true
            }, {
                "requestedDocumentId": 12,
                "isPending": true
            }, {
                "requestedDocumentId": 13,
                "isPending": true
            }, {
                "requestedDocumentId": 6,
                "isPending": true
            }],
            "note": "missing copy of bills local test isPending = true"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- Upload ')
        .post(claimsUrl2 + "file/upload?sessionToken=" + json.token, form, {
            json: false,
            headers: {
                'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
                'content-length': form.getLengthSync()
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- Submit ')
        .post(claimsUrl2 + "claim/broker/submit?sessionToken=" + json.token, {
            "claimId": 141
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- void ')
        .post(claimsUrl2 + "claim/broker/void?sessionToken=" + json.token, {
            "claimId": 141,
            "note": "void"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- Insurer(Reject) ')
        .post(claimsUrl2 + "claim/insurer/reject?sessionToken=" + json.token, {
            "ClaimId": 142,
            "Remarks": "test test test rejected"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim- Insurer(In Process) ')
        .post(claimsUrl2 + "claim/broker/insurer/inprocess?sessionToken=" + json.token, {
            "ClaimId": "141",
            "Note": "test test test",
            "InsurerReferenceNumber": "AIA6601234444"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
        //*********************************End Of Claims***********************************//
    frisby.create('ClaimTest - Batch- Flex-create')
        .post(claimsUrl2 + "claim/broker/batch/flex/create?sessionToken=" + json.token, {
            "arrangementId": 12,
            "payrollDate": "2015-08-10"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Batch- Arrangements')
        .get(claimsUrl2 + "claim/broker/batch/arrangements?pageSize&pageNumber&keyword&sort&order&insurerCode=GE&VisitType=Inpatient&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Batch- Save')
        .post(claimsUrl2 + "claim/broker/batch/save?sessionToken=" + json.token, {
            "categoryCode": "INS",
            "arrangementId": 20,
            "insurerCode": "GE",
            "entityIds": ["CRM504"],
            "visitType": "inpatient"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Batch- List')
        .get(claimsUrl2 + "claim/{{PORTAL}}/batch/list?pageSize&pageNumber&keyword&sort&order&category=INS&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Batch- Submit')
        .post(claimsUrl2 + "claim/broker/batch/submit/1?sessionToken=" + json.token, {}, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Batch- Download')
        .get(claimsUrl2 + "claim/broker/batch/download/1?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'text/plain')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Batch- Get')
        .get(claimsUrl2 + "claim/broker/batch/1?category=INS&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'json')
        .expectStatus(200)
        .toss()
        /************************End Of Batch**********************************************/
    frisby.create('ClaimTest - Claim Type Group(List)')
        .get(claimsUrl2 + "flexconfig/claimtypegroup/list?arrangementId=0&planId&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim Type Group(Details)')
        .get(claimsUrl2 + "flexconfig/claimtypegroup/1?arrangementId=0&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim Type Group(Update)')
        .post(claimsUrl2 + "flexconfig/claimtypegroup/save?ArrangementId=8&PlanId=Ij43ckLXZUW_jGDVMyVzCA&sessionToken=" + json.token, [{
            "ObjectId": 33,
            "Name": "Claim Type Group 06",
            "IsEmployeeEligible": true,
            "IsPartnerEligible": true,
            "IsSpouseEligible": true,
            "IsChildEligible": true,
            "IsParentEligible": true,
            "Remarks": "Test update",
            "Classification": "Custom",
            "FlexClaimTypes": [{
                "ObjectId": 1,
                "IsIncluded": true
            }, {
                "ObjectId": 2,
                "IsIncluded": true
            }, {
                "ObjectId": 3,
                "IsIncluded": true
            }, {
                "ObjectId": 4,
                "IsIncluded": false
            }],
            "SpendingAccounts": [{
                "SpendingAccountId": 2
            }]
        }], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim Type(List)')
        .get(claimsUrl2 + "flexconfig/claimtype/list?arrangementId=0&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim Type(Details)')
        .get(claimsUrl2 + "flexconfig/claimtype/1?arrangementId=0&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim Type(Insert)')
        .post(claimsUrl2 + "flexconfig/claimtype/save?sessionToken=" + json.token, {
            "ArrangementId": 1,
            "Name": "Claim Type 0999",
            "Taxable": false,
            "Remarks": "Test insert"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Claim Type(Save List)')
        .post(claimsUrl2 + "flexconfig/claimtype/savelist?sessionToken=" + json.token, {
            "ArrangementId": 1,
            "FlexClaimTypes": [{
                "ObjectId": 9,
                "Name": "Claim Type 9990",
                "Taxable": true,
                "Remarks": "Test list save x"
            }, {
                "ObjectId": 11,
                "Name": "Claim Type 0011",
                "Taxable": true,
                "Remarks": "Test list save x"
            }, {
                "ObjectId": 10,
                "Name": "Claim Type 0010",
                "Taxable": true,
                "Remarks": "Test list save x"
            }]
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
        /**********************************************Ended Of Config ****************************************************************************/
    frisby.create('ClaimTest - Letter(Get)')
        .get(claimsUrl2 + "letter/broker/27?sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Letter(GetList)')
        .get(claimsUrl2 + "letter/broker/list?incurredDate=2015-05-04&employeeId=2779&claimId&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Letter(Save)')
        .post(claimsUrl2 + "letter/broker/save?sessionToken=" + json.token, {
            "entityId": "CRM1462",
            "employeeId": 2779,
            "admissionDate": "2015-06-01",
            "insurerCode": "True",
            "insurerReferenceNumber": "4657Sdsa",
            "reasonId": 7,
            "reasonOthers": "",
            "file": {
                "fileName": "from-doctor-tan.jpg",
                "tempFileName": "a149cd5d-7f94-4e63-a23e-bbac5ab97a42.jpg"
            }
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Letter(Search)')
        .get(claimsUrl2 + "letter/broker?pageSize&pageNumber&keyword&sort&order&entityId=CRM1462&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
        /****************************************End of LOG *******************************************************************************************/
    frisby.create('ClaimTest - Lookup(Type Groups)')
        .get(claimsUrl2 + "claim/broker/typegroups?category=FLX&entityId=CRM504&claimantType=self&employeeId=243&incurredDate=2015-07-31&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Lookup(Benefit-Get)')
        .get(claimsUrl2 + "claim/broker/benefits?entityId=CRM504&employeeId=243&category=ALL&incurredDate=2015-07-31&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Lookup(Types-Get)')
        .get(claimsUrl2 + "/claim/broker/types?incurredDate=2015-08-01&benefitType=GHS&category=INS&entityId=CRM504&employeeId=3912&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Lookup(Insurer-Get)')
        .get(claimsUrl2 + "claim/broker/insurers?entityId=CRM1462&employeeId=2779&admissionDate=2015-05-15&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Lookup(Fields-Get)')
        .get(claimsUrl2 + "/claim/broker/fields?typeId=3&category=INS&employeeId=3912&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Lookup(Providers)')
        .get(claimsUrl2 + "lookup/broker/provider?type=Private&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Lookup(Reason)')
        .get(claimsUrl2 + "lookup/broker/reason?category=ins&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Lookup(Claimant)')
        .get(claimsUrl2 + "lookup/employee/claimant?employeeId=2779&category=INS&incurredDate=2015-03-04&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
        /************************************************ End of Lookup ******************************************************************************/
    frisby.create('ClaimTest - Referral(GetList)')
        .get(claimsUrl2 + "referral/broker/list?incurredDate=2015-04-03&employeeId=2779&sessionToken=" + json.token)
        .expectHeaderContains('Content-Type', 'application/json')
        .expectStatus(200)
        .toss()
    frisby.create('ClaimTest - Referral(Save)')
        .post(claimsUrl2 + "referral/broker/save?sessionToken=" + json.token, {
            "EmployeeId": "1231",
            "ReferredToProviderId": "1",
            "ReasonId": "9999",
            "ReasonOthers": "This is a test.",
            "ReferralDate": "2015-03-01",
            "ReferredByProviderId": "1",
            "File": {
                "FileName": "bok1.xlsx",
                "TempFileName": "ab29d665-5d7f-4419-9f0e-6b481e09c78f.xlsx"
            }
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectStatus(200)
        .toss()
};
exports.ClaimTest = ClaimTest;
