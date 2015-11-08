define(['durandal/app', 'knockout', 'jquery', 'xml2json', 'moment', './dialog/DetailsDialog', './dialog/GlobalDialog'], function(app, ko, $, xml2json, moment, DetailsDialog, GlobalDialog) {
    // declare var
    var unitDetailPages = ko.observableArray([1]),
        isNextPageEnabled = ko.observable(false),
        isPreviousPageEnabled = ko.observable(false),
        lastPage = 1,
        pageSize = ko.observable(10),
        pageNumber = ko.observable(1),
        Uresult = ko.observableArray([]),
        Gresult = ko.observableArray([]),
        resultUnit = [],
        globalResult = [],
        date = moment().format(),
        // urlPost = 'http://localhost:64737/api/1/results',
        // urlGet = 'http://localhost:64737/api/1/results/get?unitTypeID=1',
        // urlDelete = 'http://localhost:64737/api/1/results/delete?resultID=',
        urlPost = 'https://ystest.azurewebsites.net/api/1/results',
        urlGet = 'https://ystest.azurewebsites.net/api/1/results/get?unitTypeID=1',
        urlDelete = 'https://ystest.azurewebsites.net/api/1/results/delete?resultID=',
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
        },
        getRows = function(offset) {
            var newpage = [];
            $.ajax({
                type: 'GET',
                url: urlGet + '&limit=10&offset=' + offset,
                data: "json",
                success: function(data, status, xhr) {
                    var state;
                    for (var i = 0; i < data.results.length; i++) {
                        newpage.push({
                            id: data.results[i].resultID,
                            date: moment(data.results[i].date).format('MMMM Do YYYY, h:mm:ss a'),
                            percent: data.results[i].upercent
                        })
                    }
                    Uresult(newpage);
                    refresh();
                },
                error: function(xhr) {
                    alert(xhr.responseText);
                }
            });
        },
        //End of pagination
        removePost = function(data) {
            app.showMessage('Are you sure you want to remove ?', 'Remove Confirmation', ['Yes', 'No'], true).then(function(dialogResult) {
                if (dialogResult === "Yes") {
                    $.ajax({
                        async: false,
                        url: urlDelete + data.id,
                        type: "DELETE",
                        dataType: 'json',
                        ContentType: 'application/json',
                        success: function(data, textStatus, xhr) {
                            pageNumber(1);
                            app.showMessage(data, 'Remove Confirmation', ['Close'], true);
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            alert("An error occurred!!");
                        }
                    });
                } else if (dialogResult === "No") {
                    this.isCancelled = true;
                }
            });
        },
        offset = function(callback) {
            $.ajax({
                type: 'GET',
                url: urlGet + '&limit=10&offset=0',
                data: "json",
                success: function(data, status, xhr) {
                    if (callback) {
                        callback(data);
                    }
                },
                error: function(xhr) {
                    alert(xhr.responseText);
                }
            });
        },
        UviewDetails = function(data) {
            DetailsDialog.show(data.id).then(function(response) {
                if (response == "ok") {
                    alert("DELETE");
                }
            });
        },
        GviewDetails = function(data) {

            GlobalDialog.show(data.id).then(function(response) {
                if (response == "ok") {
                    alert("DELETE");
                }
            });
        },
        refresh = function(callback) {
            $.ajax({
                type: 'GET',
                url: urlGet,
                data: "json",
                success: function(data, status, xhr) {
                    updatePages(data.results.length);
                    if (callback) {
                        callback(data);
                    }
                },
                error: function(xhr) {
                    alert(xhr.responseText);
                }
            });
        },
        loadfn = function() {
            refresh(function(data) {
                var Grefresh = [],
                    Urefresh = [];
                if (data.results.length > 0) {
                    if (data.results[0].gpercent > 30) {
                        state = "glyphicon glyphicon-remove-sign"
                    } else {
                        state = "glyphicon glyphicon-ok-sign"
                    }
                    Grefresh.push({
                        id: data.results[0].resultID,
                        name: "Global Test",
                        date: moment(data.results[0].date).format('MMMM Do YYYY, h:mm:ss a'),
                        status: state
                    })
                    Gresult(Grefresh);
                    offset(function(data) {
                        for (var i = 0; i < data.results.length; i++) {
                            Urefresh.push({
                                id: data.results[i].resultID,
                                date: moment(data.results[i].date).format('MMMM Do YYYY, h:mm:ss a'),
                                percent: data.results[i].upercent
                            })
                        }
                        Uresult(Urefresh);
                    })
                } else {
                    Grefresh.push();
                    Urefresh.push();
                    Gresult(Grefresh);
                    Uresult(Urefresh);
                }
            });
        },
        activate = function() {
            if (firstload == true) {
                loadfn();
                firstload = false;
                setInterval(function() {
                    if (update == false) {
                        loadfn();
                    }
                }, 5000);

            } else {
                setInterval(function() {
                    if (update == false) {
                        loadfn();
                    }
                }, 5000);

            }
        }
    return {
        Uresult: Uresult,
        Gresult: Gresult,
        resultUnit: resultUnit,
        globalResult: globalResult,
        activate: activate,
        GviewDetails: GviewDetails,
        UviewDetails: UviewDetails,
        removePost: removePost,
        isNextPageEnabled: isNextPageEnabled,
        isPreviousPageEnabled: isPreviousPageEnabled,
        previousPage: previousPage,
        nextPage: nextPage,
        pageNumber: pageNumber,
        updatePages: updatePages,
        unitDetailPages: unitDetailPages,
        setPage: setPage,
        attached: function() {
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
        }
    };
});
