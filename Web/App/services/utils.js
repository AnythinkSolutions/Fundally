/** 
  * @module Several utils for the app
*/

define(function () {
    return {
        getCurrentDate: getCurrentDate,
        getSaveValidationErrorMessage: getSaveValidationErrorMessage,
        getEntityValidationErrorMessage: getEntityValidationErrorMessage,
        getURLParameter: getURLParameter,
        getDefinitions: getDefinitions,
        getDefaultDefinition: getDefaultDefinition,
        isSameDate: isSameDate,
        sortActivities: sortActivities,
        sortActivitiesByDueDate: sortActivitiesByDueDate,
    }

    /**
     * Get parameters from url
     * @param {string} name - The name of the parameter
     * @return {string}
    */
    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.href) || [, null])[1]
        );
    }

    /** 
     * Get current date
     * @return {Date} - Current date
    */ 
    function getCurrentDate() {
        return new Date();
    }

    /**
     * Provisional version returns validation error messages 
     * of first entity that failed to save
     * @param {object} saveError - The save error object
     * @return {string} - Error validation message
    */ 
    function getSaveValidationErrorMessage(saveError) {
        try { // return the first entity's error message(s)
            var firstError = saveError.entityErrors[0];
            return 'Validation Error: ' + firstError.errorMessage;
        } catch (e) { // ignore problem extracting error message 
            return "Save validation error";
        }
    }

    /**
     * Return string of an entity's validation error messages 
     * @param {entity} entity
     * @return {string} - Error messages
    */
    function getEntityValidationErrorMessage(entity) {
        try {
            var errs = entity.entityAspect.getValidationErrors();
            var errmsgs = errs.map(function (ve) { return ve.errorMessage; });
            return errmsgs.length ? errmsgs.join("; ") : "no validation errors";
        } catch (e) {
            return "not an entity";
        }
    }

    function getDefinitions(data, itemType, itemSubType) {
        return $.grep(data, function (a) { return a.itemType() == itemType && (itemSubType == null || a.itemSubType() == itemSubType); });
    }

    function getDefaultDefinition(data) {
        return $.grep(data, function (a) { return a.isDefault() == true; })[0];
    }

    function isSameDate(x, y) {
        return x != null && y != null && x.getFullYear() === y.getFullYear() && x.getMonth() == y.getMonth() && x.getDate() == y.getDate();
    }

    function sortActivitiesByDueDate(left, right, descending) {
        var leftTime = left.dueDate().getTime();
        var rightTime = right.dueDate().getTime();

        if (leftTime < rightTime)
            return -1;
        else if (leftTime === rightTime)
            return 0;
        else
            return 1;
    }

    function sortActivities(left, right, descending) {
        
        var factor = descending ? 1 : -1;

        var leftTime = left.activityDate().getTime();
        var rightTime = right.activityDate().getTime();

        if (leftTime < rightTime)
            return -1 * factor;
        else if (leftTime === rightTime)
            return 0;
        else
            return 1 * factor;

    }
});