var frisby = require('frisby');
var flexUrl = "http://cxa-dev-api.azurewebsites.net",
    authUrl = "http://cxa-dev-api.azurewebsites.net",
    authUrl2 = "http://cxa-dev-api.azurewebsites.net",
    entityUrl = "http://cxa-dev-api.azurewebsites.net"


/*=======================Directory========================
    1.0 Claims API
    2.0 Checkout API
    3.0 Employee Benefit API
    4.0 Menu API
    5.0 EmployeeCensus API
    ===============End Of Directory======================*/

var FlexTest = function() {
 

    /*========================================================================================================================
    ========================================== 2.1 EmployeeCensus ============================================================
    ==========================================================================================================================*/
    frisby.create('FlexTest - (POST) Approve Changes')
        .post(flexUrl + "api/1/employeeCensus/approve?entityId=CRM114&employeeId&sessionToken=" + json.token, [11403], {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

    .expectStatus(200)
        .toss()

    frisby.create('FlexTest - (GET) Approved Changes listing')
        .get(flexUrl + "api/1/employeeCensus/approved?entityId=CRM500&employeeId=70&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - (GET) Approved Changes group')
        .get(flexUrl + "api/1/employeeCensus/approvedGroupByEmployeeId?entityId=CRM500&employeeId=70&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')

    .toss()

    frisby.create('FlexTest - (GET) Benefit field metadata')
        .get(flexUrl + "api/1/employeeCensus/benefit/fields?entityId=CRM503&benefitType&placementId=3&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')

    .toss()

    frisby.create('FlexTest - (GET)Benefit type listing')
        .get(flexUrl + "api/1/employeeCensus/benefit/types?entityId&placementId=3&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - (GET)Benefit list of emp and dep')

    .get(flexUrl + "api/1/employeeCensus/benefits?entityId=CRM500&employeeId=70&dependantId&placementId=3&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - (GET)Benefits summary')
        .get(flexUrl + "api/1/employeeCensus/benefitsSummary/me?sessionToken=" + json.token)
        .expectStatus(200)
        .toss()

    frisby.create('FlexTest - (GET)Benefits clientid by entid')
        .get(flexUrl + "api/1/employeeCensus/clientID?entityId=CRM504&sessionToken=" + json.token)
        .expectStatus(200)
        .toss()

    frisby.create('FlexTest - (GET)Dependant details by the dependant Id')
        .get(flexUrl + "api/1/employeeCensus/dependant/1210?entityId=CRM504&sessionToken=" + json.token)
        .expectStatus(200)
        .toss()

    /*POST - Compare upload data for changes*/
    

    frisby.create('FlexTest - (POST)create dependant')
        .post(flexUrl + "api/1/employeeCensus/dependant/create?entityId=CRM113&employeeId=1112&effectiveDate=1 Aug 2015&evidenceUrl&sessionToken=" + json.token, {
            "fullName": "pys",
            "relationship": "Parent",
            "identification": "s21323131F",
            "birthDate": "1 Aug 2015"
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

    .expectStatus(200)
        .toss()

    /*POST - Delete dependent*/


    frisby.create('FlexTest - dependant fields')
        .get(flexUrl + "api/1/employeeCensus/dependant/fields?entityId=CRM500&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    /*POST - Update dependent*/



    frisby.create('FlexTest - dependant me')
        .get(flexUrl + "api/1/employeeCensus/dependant/me?sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    frisby.create('FlexTest - dependant by list')
        .get(flexUrl + "api/1/employeeCensus/dependant?dependantIdList=1&entityId=CRM504&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    frisby.create('FlexTest - dep list by emp id')
        .get(flexUrl + "api/1/employeeCensus/dependant?dependantIdList=1&entityId=CRM504&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()



    frisby.create('FlexTest - dependant list of login')
        .get(flexUrl + "api/1/employeeCensus/dependant?entityId=CRM500&employeeId=1&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    // Get download temp for upload

    // Get download validation summary after uploading


    // Get the employee detail by employee Id.
    //Get employee default columns for employee listing.

    frisby.create('FlexTest - employee employeeid')
        .get(flexUrl + "api/1/employeeCensus/employee/70?entityId=CRM500&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    frisby.create('FlexTest - employee cloumns')
        .get(flexUrl + "api/1/employeeCensus/employee/columns?entityId&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    //POST create new employee 

    frisby.create('FlexTest - create root employee')
        .post(flexUrl + "api/1/employeeCensus/employee/createRoot&sessionToken=" + json.token)
        .expectStatus(200)
        .toss()

    //POST Delete employee


    frisby.create('FlexTest - employee fields')
        .get(flexUrl + "api/1/employeeCensus/employee/fields?entityId&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    //POST Update employee

    frisby.create('FlexTest - employee  me')
        .get(flexUrl + "api/1/employeeCensus/employee/me?sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    frisby.create('FlexTest - employee listing')
        .get(flexUrl + "api/1/employeeCensus/employee?entityId=3911&pageSize=1&pageNumber=1&sort&order&keyword&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()



    frisby.create('FlexTest - employee multiple details')
        .get(flexUrl + "api/1/employeeCensus/employee?employeeIdList=9,8&entityId=CRM500&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    frisby.create('FlexTest - ePEnding change listing')
        .get(flexUrl + "api/1/employeeCensus/pending?entityId&employeeId&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()



    // Pending for approve  change

    frisby.create('FlexTest - employee getTemplateList')
        .get(flexUrl + "api/1/employeeCensus/getTemplateList?sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - Changes pendingGroupByEmployeeId')
        .get(flexUrl + "api/1/employeeCensus/pendingGroupByEmployeeId?entityId&employeeId=70&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    //Reject the changes








    //Upload emp census data





    //---------------------------------------------placement---------------------------------------------------------------//


    //POST benefit assing

    frisby.create('FlexTest - employee getTemplateList')
        .get(flexUrl + "api/1/placement/benefit/download?entityIds=['CRM504']&placementIds=[10]&sessionToken=" + json.token)
        .expectStatus(200)
        .toss()

    frisby.create('FlexTest - emp/benefit fields meta data')
        .get(flexUrl + "api/1/placement/benefit/fields?entityIds=['CRM504']&placementIds=[10]&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - benefit fields metadata')
          .get(flexUrl + "api/1/placement/benefit/fields?placementIds=[10]&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - emp own benefit type')
        .get(flexUrl + "api/1/placement/benefit/types/me?entityId=CRM504&incurredDate=2015-07-31&employeeId=3912&benefitType&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - incurred date/benefit type and emps selected plan.')
        .get(flexUrl + "api/1/placement/benefit/types?entityId=CRM504&employeeId=3912&dependantId=0&incurredDate=2015-07-3&benefitType&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - incurred date/benefit type and emps selected plan.')
        .get(flexUrl + "api/1/placement/benefit/types?entityIds=['CRM504']&placementIds=[10]&benefitType=GTL&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    // POST - Upload the employee benefit plan assignments.

    // Get the employee and plan assignments listing.

    frisby.create('FlexTest - employee and plan assignments listing.')
        .get(flexUrl + "api/1/placement/benefit/view?entityIds=['CRM504']&placementIds=[10]&pageSize=10&pageNumber=1&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()


    // Benefitgroup upload

    // Get benefitgroup download

    frisby.create('FlexTest - Benefitgroup download')
        .get(flexUrl + "api/1/placement/benefitgroup/download?placementId=10&sessionToken=" + json.token)
        .expectStatus(400)
        .toss()

    //POST  create placement group 

    frisby.create('FlexTest - create placement group')
        .post(flexUrl + "api/1/placement/group/create?placementId=10&sessionToken=" + json.token)
        .expectStatus(400)
        .toss()


    //POST  create placement delete 


    //POST  create placement update 

    frisby.create('FlexTest - placement group')
        .get(flexUrl + "api/1/placement/group?placementId=10&sessionToken=" + json.token)
        .expectStatus(200)
        .toss()



    frisby.create('FlexTest - placement details')
        .get(flexUrl + "api/1/placement/placementDetail?placementId=10&sessionToken=" + json.token)
        .expectStatus(200)
        .toss()


    frisby.create('FlexTest - placement list')
        .get(flexUrl + "api/1/placement/placementList?entityIds=['CRM504']&placementIds=[10]&sessionToken=" + json.token)
        .expectStatus(200)
        .toss()


    // placement price update

    // placement price
    
    // placement upload



    //-------------------------------------------------------Insurer------------------------------------------------------//

    frisby.create('FlexTest - Download the employee census information for a specific placement and insurer')
        .get(flexUrl + "api/1/insurer/employeelist?brokerConfigId=1&ELType=Preview&placementId=5&insurerCode=GE&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - Emp listing convert')
        .get(flexUrl + "api/1/insurer/employeelisting-convert?listId=8&ELType=Renewal&sessionToken=" + json.token)
        .expectStatus(200)
        .toss()

    frisby.create('FlexTest - employeelistinginfo')
        .get(flexUrl + "api/1/insurer/employeelistinginfo?brokerConfigId=1&pageSize=1&pageNumber=10&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()



    //generateemployeelistdelta
    //____________________________

    //get file 
    //____________________________


    frisby.create('FlexTest - placement info')
        .get(flexUrl + "api/1/insurer/insurerplacementinfo?brokerConfigId=1&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - listing')
        .get(flexUrl + "api/1/insurer/listing?sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()

    frisby.create('FlexTest - movement info')
        .get(flexUrl + "api/1/insurer/movementinfo?insurerName&pageSize=10&pageNumber=1&sessionToken=" + json.token)
        .expectStatus(200)
        .expectHeaderContains('content-type', 'json')
        .toss()



};


console.log("TEST Under flex API");
exports.FlexTest = FlexTest;
