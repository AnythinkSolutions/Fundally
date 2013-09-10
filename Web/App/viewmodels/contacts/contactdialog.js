define(['services/utils', 'durandal/app'], function (utils, app) {
    var uow = null;

    var viewModel = {
        donor: ko.observable(),
        contact: ko.observable(),
        contactTypes: ko.observableArray(),
        phoneTypes: ko.observableArray(),
        defaultContactType: null,
        defaultPhoneType: null,
        isSaved: false,
        isNew: ko.observable(false),

        activate: activate,
        save: save,
        cancel: cancel,

        addPhone: addPhone,
        deletePhone: deletePhone,
        deleteContact: deleteContact,
    };

    return viewModel;

    function activate(params) {
        var self = this;
        uow = params.uow;
        self.donor(params.donor);

        uow.definitions.all()
            .then(initializeDefinitions)
            .then(initializeContact);

        function initializeDefinitions(data) {
            viewModel.contactTypes(utils.getDefinitions(data, 'contact_type'));
            viewModel.phoneTypes(utils.getDefinitions(data, 'phone_type', 'contact'));
            viewModel.defaultContactType = utils.getDefaultDefinition(self.contactTypes());
            viewModel.defaultPhoneType = utils.getDefaultDefinition(self.phoneTypes());
        }

        function initializeContact() {
            if (params.contact == null) {
                viewModel.isNew(true);

                var contact = uow.contacts.create();
                self.contact(contact);
                contact.donor(self.donor());
                contact.isEditing(true);

                contact.contactType(self.defaultContactType);
                if (viewModel.donor().contacts().length == 0) {
                    contact.isPrimary(true);
                }

                var phone = uow.contacts.createRelated("Phone");
                phone.phoneType(self.defaultPhoneType);
                phone.isPrimary(true);
                contact.phones.push(phone);
                contact.primaryPhone(phone);

                viewModel.donor().contacts.push(contact);
            }
            else {
                self.contact(params.contact);
                self.contact().isEditing(true);
                viewModel.isNew(false);
            }
        }
    }

    function save(dialogResult) {
        uow.commit()
            .then(function () {
                if (viewModel.isNew) {
                    app.trigger('contact:new', viewModel.contact());
                    toastr.success('Contact created');
                }
                else {
                    app.trigger('contact:edit', viewModel.contact());
                    toastr.success('Contact saved');
                }

                viewModel.isSaved = true;
                viewModel.modal.close(dialogResult);
            })
            .fail(function (error) {
                toastr.error('Error saving contact: ' + error);
            });
    }

    function cancel(dialogResult) {
        if(viewModel.isNew)
            viewModel.donor().contacts.remove(viewModel.contact());

        uow.rollback();
        this.modal.close(dialogResult);
    }

    function deleteContact(dialogResult){
        if (!viewModel.isNew()) {
            //Confirm with user they want to delete this item
            app.showMessage('Are you sure you want to delete this contact?', 'Delete Contact', ['Yes', 'No'])
            .then(function (args) {
                if (args == 'Yes') {
                    viewModel.donor().contacts.remove(viewModel.contact());
                    viewModel.contact().entityAspect.setDeleted();

                    uow.commit()
                        .then(function () {
                            toastr.success('Contact deleted');
                            viewModel.modal.close(dialogResult);
                        })
                        .fail(function (error) {
                            toastr.error('Error deleting contact: ' + error);
                        });
                }
                else
                    return;
            });
        }
    }

    function addPhone() {
        var phone = uow.contacts.createRelated("Phone");
        viewModel.contact().phones.push(phone);

        if (viewModel.contact().phones().length == 0) {
            phone.isPrimary(true);
            viewModel.contact().primaryPhone(phone);
        }

        viewModel.contact().phones.unshift(phone);
    }

    function deletePhone(phone) {
        viewModel.contact().phones.remove(phone);
        phone.entityAspect.setDeleted();
    }
});