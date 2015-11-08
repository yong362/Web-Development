define(['durandal/app', 'plugins/dialog', 'knockout', 'jquery', 'moment'], function(app, dialog, ko, $, moment) {

    var FileUpdate = function(id) {
        this.autoclose = true;
        this.id = ko.observable('');
        var that = this;
        that.id(id);

    };

    FileUpdate.prototype.cancel = function() {
        this.isCancelled = true;
        dialog.close(this);
    };


    FileUpdate.show = function(id) {
        return dialog.show(new FileUpdate(id));
    };

    return FileUpdate;
});
