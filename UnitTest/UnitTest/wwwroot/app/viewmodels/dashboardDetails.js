define(['plugins/dialog', 'knockout', 'jquery', 'moment'], function(dialog, ko, $, moment) {

    var DashboardDetails = function(rid) {

        // alert("curent: " + rid);
        this.selectedValue = ko.observable('');
        this.selectedText = ko.observable('');
        this.CurrentResult = ko.observableArray();
        this.previousResult = ko.observableArray();
        this.dateC = ko.observable('');
        this.dateP=ko.observable('')
        this.autoclose = true;

        var that = this;
        var that2 = this;
        var Carray = [];
        var Parray = [];

        $.ajax({
            type: 'GET',
            url: 'https://ystest.azurewebsites.net/api/1/unit/get?resultID=' + rid,
            data: "json",
            success: function(data, status, xhr) {                
                console.log(data.length);
                console.log(data);

                for (var i = 0; i < data.length; i++) {
                    var validation;

                    if (data[i].ru.failures === false) {
                        validation = "glyphicon glyphicon-ok-sign";


                    } else if (data[i].ru.failures === true) {

                        validation = "glyphicon glyphicon-remove-sign";

                    }
                    if (data[i].ru.resultID == rid) {
                        that.dateC(moment(data[i].date).format('MMMM Do YYYY, h:mm:ss a'));
                        Carray.push({
                            name: data[i].ru.name,
                            failure: validation,
                            reason: data[i].ru.reason
                        });
                    } else {
                        that.dateP(moment(data[i].date).format('MMMM Do YYYY, h:mm:ss a'));
                        Parray.push({
                            name: data[i].ru.name,
                            failure: validation,
                            reason: data[i].ru.reason
                        });
                    }
                }
                console.log(Carray);
                console.log(Parray);
                that.CurrentResult(Carray);
                that2.previousResult(Parray);
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });

    };

    DashboardDetails.prototype.ok = function(response) {
        response = "ok"
        dialog.close(response);
    };


    DashboardDetails.prototype.Close = function() {
        this.isCancelled = true;
        dialog.close(this);
    };


    DashboardDetails.show = function(rid) {

        return dialog.show(new DashboardDetails(rid));
    };

    return DashboardDetails;
});
