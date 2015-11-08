define(['plugins/dialog', 'knockout','jquery','moment'], function(dialog, ko, $, moment) {

    var CustomDelete = function() {
       
        this.selectedValue = ko.observable('');
        this.selectedText = ko.observable('');
        
        this.autoclose = true;

    };




    CustomDelete.prototype.ok = function(response) {
        response = "ok"
         dialog.close(response);
    };


    CustomDelete.prototype.cancel = function() {
        this.isCancelled = true;
        dialog.close(this);
    };


    CustomDelete.show = function() {
        return dialog.show(new CustomDelete());
    };

    return CustomDelete;
});
