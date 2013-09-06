define(['durandal/modalDialog'], function (dialog) {

    var vm = {
        activity: ko.observable(),
        rules: ko.observable(),
        
        activate: function(params){
            var self = this;
            self.activity(params);
        },

        save: function () {
            dialog.close();
        },

        cancel: function () {
            dialog.close();
        }

    };
    
    //vm.prototype.close = function (dialogResult) {
    //    dialog.close(this, dialogResult);
    //};

    return vm;

});