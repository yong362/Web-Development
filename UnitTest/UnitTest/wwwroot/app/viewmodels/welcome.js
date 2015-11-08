 define(['durandal/app', 'knockout', 'jquery', 'xml2json', './customModal', './customDelete', './dashboardDetails', 'moment', 'bootstrap'], function(app, ko, $, xml2json, CustomModal, CustomDelete, DashboardDetails, moment, bootstrap) {

     var people = ko.observableArray([]),
         unitDetailPages = ko.observableArray([1]),
         insuredClaimColumns = ko.observableArray(),
         insuredClaimRows = ko.observableArray(),
         isNextPageEnabled = ko.observable(false),
         isPreviousPageEnabled = ko.observable(false),
         lastPage = 1,
         pageSize = ko.observable(10),
         pageNumber = ko.observable(1),
         dCategory = ko.observableArray([]),
         // urlPost = 'http://localhost:64737/api/1/results',
         // urlGet = "http://localhost:64737/api/1/message",
         // urlDelete = 'http://localhost:64737/api/1/results/delete?resultID=',
         urlPost = 'https://ystest.azurewebsites.net/api/1/results',
         urlGet = 'https://ystest.azurewebsites.net/api/1/results/get?unitTypeID=3',
         urlDelete = 'https://ystest.azurewebsites.net/api/1/results/delete?resultID=',
         peoplearray = [],
         filter = ko.observable(""),
         dfilter = ko.observable(''),
         update = false,
         firstload = true,
         //Start of pagination
         previousPage = function(data, event) {
             if (pageNumber() > 1) {
                 pageNumber(pageNumber() - 1);
             }
         },
         nextPage = function(data, event) {
             if (pageNumber() < lastPage) {
                 pageNumber(pageNumber() + 1);
             }
         },
         setPage = function(page, data, event) {
             if (page >= 1 && page <= lastPage) {
                 pageNumber(page);
             }
         },
         updatePages = function(totalRows) {
             lastPage = Math.ceil(totalRows / pageSize());
             if (pageNumber() > lastPage && lastPage > 0) {
                 pageNumber(lastPage);
             } else if (pageNumber < 1) {
                 pageNumber(1);
             } else {
                 var pages = [],
                     p;
                 if (lastPage < 6) {
                     for (p = 1; p <= lastPage; p++) {
                         pages.push(p);
                     }
                 } else if (pageNumber() <= 3 || pageNumber() >= (lastPage - 2)) {
                     for (p = 1; p <= 3; p++) {
                         pages.push(p);
                     }
                     pages.push('...');
                     for (p = (lastPage - 2); p <= lastPage; p++) {
                         pages.push(p);
                     }
                 } else {
                     pages.push(1);
                     pages.push('...');
                     for (p = pageNumber() - 1; p <= pageNumber() + 1; p++) {
                         pages.push(p);
                     }
                     pages.push('...');
                     pages.push(lastPage);
                 }
                 unitDetailPages(pages);
                 isPreviousPageEnabled(pageNumber() > 1);
                 isNextPageEnabled(pageNumber() < lastPage);
             }
         };
     //get messages from api
     refresh = function(callback) {
             $.ajax({
                 type: 'GET',
                 url: urlGet,
                 data: "json",
                 success: function(data, status, xhr) {
                     // var state;
                     updatePages(data.results.length);
                     if (callback) {
                         callback(data);
                     }
                 },
                 error: function(xhr) {
                     $('.alert-danger').show();
                     setTimeout(function() {
                         $('.alert-danger').hide();
                     }, 3000);
                 }
             });
         },
         offsetpage = function(callback) {
             // urlGet = "http://localhost:64737/api/1/message";
             urlGet = "https://ystest.azurewebsites.net/api/1/message";
             $.ajax({

                 type: 'GET',
                 url: urlGet + '?limit=10&offset=0',
                 data: "json",
                 success: function(data, status, xhr) {
                     if (callback) {
                         callback(data);
                     }
                 },
                 error: function(xhr) {
                     $('.alert-danger').show();
                     setTimeout(function() {
                         $('.alert-danger').hide();
                     }, 3000);
                 }
             });
         },
         getRows = function(offset) {
             var urlpage;
             console.log(filter());
             if (filter() != null) {
                 var urlpage = 'https://ystest.azurewebsites.net/api/1/message?name=' + filter() + '&limit=10&offset=' + offset;
             } else {
                 urlpage = 'https://ystest.azurewebsites.net/api/1/message?limit=10&offset=' + offset;
             }
             var newpage = [];
             $.ajax({

                 type: 'GET',
                 url: urlpage,
                 data: "json",
                 success: function(data, status, xhr) {
                     for (var i = 0; i < data.results.length; i++) {
                         var tootipAlert;
                         var alertIcon;
                         if (data.results[i].catID == "2") {
                             alertIcon = "glyphicon glyphicon-pencil";
                             tootipAlert = "Update";
                         } else if (data.results[i].catID == "3") {
                             alertIcon = "glyphicon glyphicon-alert";
                             tootipAlert = "Alert";
                         } else if (data.results[i].catID == "4") {
                             alertIcon = "glyphicon glyphicon-info-sign";
                             tootipAlert = "Remarks";
                         }
                         newpage.push({
                             pid: data.results[i].msgID,
                             rid: data.results[i].resultID,
                             name: data.results[i].name,
                             createdOn: moment(data.results[i].createOn).format('MMMM Do YYYY, h:mm:ss a'),
                             message: data.results[i].content,
                             selectedValue: alertIcon,
                             title: tootipAlert
                         });
                     }
                     people(newpage);
                     refresh();
                 },
                 error: function(xhr) {
                     $('.alert-danger').show();
                     setTimeout(function() {
                         $('.alert-danger').hide();
                     }, 3000);
                 }
             });
         },
         removeRows = function(pid) {
             if (pid != null) {
                 urlDelete = 'https://ystest.azurewebsites.net/api/1/message?msgID=' + pid;
                 console.log(urlDelete);
             } else if (pid === null) {
                 urlDelete = 'https://ystest.azurewebsites.net/api/1/message/all?name=' + filter();
                 console.log(urlDelete);
             }
             $.ajax({
                 async: false,
                 url: urlDelete,
                 type: "DELETE",
                 dataType: 'json',
                 ContentType: 'application/json',
                 success: function(data, textStatus, xhr) {
                     getRows(data);
                     refresh();
                     app.showMessage(data, 'Remove Confirmation', ['Close'], true);
                 },
                 error: function(xhr, textStatus, errorThrown) {
                     // alert("An error occurred!!");
                     $('.alert-danger').show();
                     setTimeout(function() {
                         $('.alert-danger').hide();
                     }, 3000);

                 }
             });

         },
         removeAllPost = function() {
             app.showMessage('Are you sure you want to remove all?', 'Remove Confirmation', ['Yes', 'No'], true).then(function(dialogResult) {
                 if (dialogResult === "Yes") {
                     var pid = null;
                     removeRows(pid);
                 } else if (dialogResult === "No") {
                     this.isCancelled = true;
                 }
             });
         };
     removePost = function(pid) {
         app.showMessage('Are you sure you want to remove ?', 'Remove Confirmation', ['Yes', 'No'], true).then(function(dialogResult) {
             if (dialogResult === "Yes") {
                 removeRows(pid);
             } else if (dialogResult === "No") {
                 this.isCancelled = true;
             }
         });
     };
     viewDetails = function(rid) {
         if (rid == undefined) {
             app.showMessage('This feature has been disabled!', 'Oops, You found something!', ['Close'], true);
         } else if (rid != undefined) {
             DashboardDetails.show(rid).then(function() {});
         }
     };
     loadfn = function() {
         offsetpage(function(data) {
             var ORefresh = [];
             for (var i = 0; i < data.results.length; i++) {
                 var tootipAlert;
                 var alertIcon;
                 if (data.results[i].catID == "2") {
                     alertIcon = "glyphicon glyphicon-pencil";
                     tootipAlert = "Update";
                 } else if (data.results[i].catID == "3") {
                     alertIcon = "glyphicon glyphicon-alert";
                     tootipAlert = "Alert";
                 } else if (data.results[i].catID == "4") {
                     alertIcon = "glyphicon glyphicon-info-sign";
                     tootipAlert = "Remarks";
                 }
                 ORefresh.push({
                     pid: data.results[i].msgID,
                     rid: data.results[i].resultID,
                     name: data.results[i].name,
                     createdOn: moment(data.results[i].createOn).format('MMMM Do YYYY, h:mm:ss a'),
                     message: data.results[i].content,
                     selectedValue: alertIcon,
                     title: tootipAlert
                 });
             }
             people(ORefresh);
             refresh();
         });
     }
     return {
         peoplekey: "value",
         people,
         dCategory,
         isNextPageEnabled: isNextPageEnabled,
         isPreviousPageEnabled: isPreviousPageEnabled,
         previousPage: previousPage,
         nextPage: nextPage,
         pageNumber: pageNumber,
         updatePages: updatePages,
         unitDetailPages: unitDetailPages,
         setPage: setPage,
         filter: filter,
         dfilter: dfilter,
         activate: function() {
             $('[data-toggle="tooltip"]').tooltip();
             this.filter.subscribe(function(filter) {
                 $.ajax({
                     url: 'https://ystest.azurewebsites.net/api/1/message?name=' + filter,
                     type: 'GET',
                     dataType: 'json',
                     success: function(data, textStatus, xhr, response) {
                         updatePages(data.results.length);
                         $.ajax({
                             url: 'https://ystest.azurewebsites.net/api/1/message?name=' + filter + '&limit=10',
                             type: 'GET',
                             dataType: 'json',
                             success: function(data, textStatus, xhr, response) {
                                 var popluate = [];
                                 for (var i = 0; i < data.results.length; i++) {
                                     var tootipAlert;
                                     var alertIcon;
                                     if (data.results[i].catID == "2") {
                                         alertIcon = "glyphicon glyphicon-pencil";
                                         tootipAlert = "Update";
                                     } else if (data.results[i].catID == "3") {
                                         alertIcon = "glyphicon glyphicon-alert";
                                         tootipAlert = "Alert";
                                     } else if (data.results[i].catID == "4") {
                                         alertIcon = "glyphicon glyphicon-info-sign";
                                         tootipAlert = "Remarks";
                                     }
                                     popluate.push({
                                         pid: data.results[i].msgID,
                                         rid: data.results[i].resultID,
                                         name: data.results[i].name,
                                         createdOn: moment(data.results[i].createOn).format('MMMM Do YYYY, h:mm:ss a'),
                                         message: data.results[i].content,
                                         selectedValue: alertIcon,
                                         title: tootipAlert
                                     });
                                     people(popluate);
                                 }
                             },
                             error: function(xhr, textStatus, errorThrown) {
                                 /*  console.log('Error in Operation');*/
                                 $('.alert-danger').show();
                                 setTimeout(function() {
                                     $('.alert-danger').hide();
                                 }, 3000);
                             }
                         });

                     },
                     error: function(xhr, textStatus, errorThrown) {
                         /*  console.log('Error in Operation');*/
                         $('.alert-danger').show();
                         setTimeout(function() {
                             $('.alert-danger').hide();
                         }, 3000);
                     }
                 });
             });
             if (firstload == true) {
                 firstload = false;
                 setInterval(function() {
                     if (update == false && filter() == "") {

                         loadfn();
                     }
                 }, 5000);

             } else {
                 setInterval(function() {
                     if (update == false && filter() !== "") {

                         loadfn();
                     }
                 }, 5000);

             }
         },
         attached: function() {
             $('[data-toggle="tooltip"]').tooltip();

             pageNumber.subscribe(function(page) {
                 //val = 2 if pageNumber is now 2
                 //do fancy calculations based on val
                 if (page == 1 || page < 1) {
                     update = false;
                 } else {
                     update = true;
                 }
                 var offset = (page - 1) * 10;
                 getRows(offset);
             })
         },
         showCustomModal: function() {
             var that = this.people,
                 rurl = this.urlGet;

             CustomModal.show().then(function() {
                 var cArray = [];

                 refresh = function(callback) {
                     $.ajax({
                         type: 'GET',
                         url: rurl,
                         data: "json",
                         success: function(data, status, xhr) {
                             updatePages(data.results.length);
                             if (callback) {
                                 callback(data);
                             }
                         },
                         error: function(xhr) {
                             $('.alert-danger').show();
                             setTimeout(function() {
                                 $('.alert-danger').hide();
                             }, 3000);
                         }
                     });
                 };
                 offsetpage = function(callback) {
                     rurl = "https://ystest.azurewebsites.net/api/1/message";
                     $.ajax({
                         type: 'GET',
                         url: rurl + '?limit=10',
                         data: "json",
                         success: function(data, status, xhr) {
                             if (callback) {
                                 callback(data);
                             }
                         },
                         error: function(xhr) {
                             $('.alert-danger').show();
                             setTimeout(function() {
                                 $('.alert-danger').hide();
                             }, 3000);
                         }
                     });
                 };
                 offsetpage(function(data) {
                     for (var i = 0; i < data.results.length; i++) {
                         var tootipAlert;
                         var alertIcon;
                         if (data.results[i].catID == "2") {
                             alertIcon = "glyphicon glyphicon-pencil";
                             tootipAlert = "Update";
                         } else if (data.results[i].catID == "3") {
                             alertIcon = "glyphicon glyphicon-alert";
                             tootipAlert = "Alert";
                         } else if (data.results[i].catID == "4") {
                             alertIcon = "glyphicon glyphicon-info-sign";
                             tootipAlert = "Remarks";
                         }
                         cArray.push({
                             pid: data.results[i].msgID,
                             rid: data.results[i].resultID,
                             name: data.results[i].name,
                             createdOn: moment(data.results[i].createOn).format('MMMM Do YYYY, h:mm:ss a'),
                             message: data.results[i].content,
                             selectedValue: alertIcon,
                             title: tootipAlert
                         });
                     }
                     that(cArray);
                     refresh();

                 });

             });
         }

     };
 });
