define(['durandal/app', 'plugins/dialog', 'knockout', 'jquery', 'moment'], function(app, dialog, ko, $, moment) {

    var CustomModal = function() {
        this.input = ko.observable('');
        this.message = ko.observable('');
        this.category = ko.observable('');
        this.selectedValue = ko.observable('');
        this.selectedText = ko.observable('');
        this.optionsValue = ko.observable('');
        this.autoclose = true;
        this.dCategory = ko.observableArray([]);



        var that = this;

        // get categories data from api
        $.ajax({
            type: 'GET',
            url: 'https://ystest.azurewebsites.net/api/1/category',
            data: "json",
            success: function(data, status, xhr) {
                for (var i = 0; i < data.length; i++) {
                    that.dCategory.push({
                        ctID: data[i].catID,
                        dName: data[i].name
                    });
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

    CustomModal.prototype.ok = function() {
        var catID;
        var items = {
            name: this.input(),
            content: this.message(),
            createOn: moment().format(),
            catID: this.selectedValue()

        };
        console.log(items);
        var that = this;
        //disable button when submit to prevent multiple ajax post request
        $("#btnSubmit").prop("disabled", true);
        
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            url: 'https://ystest.azurewebsites.net/api/1/message',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(items),
            success: function(data, textStatus, xhr) {
                app.showMessage('Message has been added.', 'Create Confirmation', ['Close'], true);
                dialog.close(that, data);
            },
            error: function(xhr, textStatus, errorThrown) {
                $('.alert-danger').show();
                setTimeout(function() {
                    $('.alert-danger').hide();
                }, 3000);
            }
        });
    };


    CustomModal.prototype.cancel = function() {
        this.isCancelled = true;
        dialog.close(this);
    };


    CustomModal.show = function() {
        return dialog.show(new CustomModal());
    };

    return CustomModal;
});
