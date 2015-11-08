define(['plugins/dialog', 'knockout', 'jquery', 'moment'], function(dialog, ko, $, moment) {

    var DetailsDialog = function(id) {

        this.selectedValue = ko.observable('');
        this.selectedText = ko.observable('');
        this.result = ko.observableArray();
        this.autoclose = true;

        var that = this;
        var array = [];
        $.ajax({
            type: 'GET',
            url: 'https://ystest.azurewebsites.net/api/1/global/get?resultID=' + id,
            data: "json",
            success: function(data, status, xhr) {
                for (var i = 0; i < data.length; i++) {
                    var validation;

                    if (data[i].failures === false) {
                        validation = "glyphicon glyphicon-ok-sign";


                    } else if (data[i].failures === true) {

                        validation = "icon-Cross";

                    }
                    array.push({
                        name: data[i].name,
                        failure: validation,
                        reason: data[i].reason,
                        time: moment(data[i].time).format('MMMM Do YYYY, h:mm:ss a')
                    });
                }
                that.result(array);
                console.log(that.result.length);
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    };
    DetailsDialog.prototype.ok = function(response) {
        response = "ok"
        dialog.close(response);
    };


    DetailsDialog.prototype.Close = function() {
        this.isCancelled = true;
        dialog.close(this);
    };

    DetailsDialog.show = function(id) {
        return dialog.show(new DetailsDialog(id));
    };


    return DetailsDialog;
});
