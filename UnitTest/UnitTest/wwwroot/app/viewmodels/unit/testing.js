define(['durandal/app', 'knockout', 'jquery', 'xml2json', 'moment', './dialog/DetailsDialog', './dialog/GlobalDialog', './dialog/FileUpdate' ,'dropzone', 'jqueryui'], function(app, ko, $, xml2json, moment, DetailsDialog, GlobalDialog, FileUpdate, dropzone, jqueryui) {
    // declare var

    var unitDetailPages = ko.observableArray([1]),
        isNextPageEnabled = ko.observable(false),
        isPreviousPageEnabled = ko.observable(false),
        lastPage = 1,
        pageSize = ko.observable(10),
        pageNumber = ko.observable(1),
        Uresult = ko.observableArray([]),
        resultUnit = [],
        globalResult = [],
        date = moment().format(),
        urlUpload = 'https://ystest.azurewebsites.net/api/1/results',
        urlDownload = 'https://ystest.azurewebsites.net/api/1/file/download?id=',
        urlGet = 'https://ystest.azurewebsites.net/api/1/file/get',
        urlDelete = 'https://ystest.azurewebsites.net/api/1/file/delete?id=',
        update = false,
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
                url: urlGet + '?limit=10&offset=' + offset,
                data: "json",
                success: function(data, status, xhr) {
                    var state;
                    for (var i = 0; i < data.results.length; i++) {
                        newpage.push({
                            id: data.results[i].fileID,
                            name: data.results[i].fileNames,
                            extension: data.results[i].extension,
                            date: moment(data.results[i].creatOn).format('MMMM Do YYYY, h:mm:ss a')
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
                    type: 'DELETE',
                        ContentType: 'application/json',
                        success: function(data, textStatus, xhr) {
                            pageNumber(1);
                            app.showMessage(data, 'Remove Confirmation', ['OK'], true);
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
                url: urlGet + '?limit=10&offset=0',
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
        //opening of dialog
        UviewDetails = function(data) {
            $.ajax({
                type: 'GET',
                url: urlDownload + data.id,
                data: "json",
                success: function(data, status, xhr) {
                    window.open(data);
                },
                error: function(xhr) {
                    alert(xhr.responseText);
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
        activate = function() {
            setInterval(function() {
                if (update == false) {
                    refresh(function(data) {
                        var Grefresh = [],
                            Urefresh = [];
                        if (data.results.length > 0) {
                            offset(function(data) {
                                for (var i = 0; i < data.results.length; i++) {
                                    Urefresh.push({
                                        id: data.results[i].fileID,
                                        name: data.results[i].fileNames,
                                        extension: data.results[i].extension,
                                        date: moment(data.results[i].creatOn).format('MMMM Do YYYY, h:mm:ss a')
                                    })
                                }
                                Uresult(Urefresh);
                            })
                        } else {
                            Urefresh.push();
                            Uresult(Urefresh);
                        }
                    });
                }
            }, 5000);
        }
        updateFile = function(id) {
        if (id == undefined) {
            app.showMessage('This feature has been disabled!', 'Oops, You found something!', ['Close'], true);
        } else if (id != undefined) {
            FileUpdate.show(id).then(function() {});
        }
    };

    return {
        Uresult: Uresult,
        resultUnit: resultUnit,
        globalResult: globalResult,
        activate: activate,
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
