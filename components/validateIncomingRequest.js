var Validator = require('jsonschema').Validator;
var v = new Validator();

// Load Request Payload Schema
var { payloadSchema } = require('../request.payload.schema');

const checkDatePattern = (dateValue) => {
    // Regular expression to check if string is valid date formatted yyyy-mm-dd
    const regexExp = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    return regexExp.test(dateValue);
}

const validateIncomingRequest = (incomingObject) => {
    let validStatus = -1;
    // true if incomingObject has all valid data entries
    // false if incomingObject has no valid data entries
    let validSchema = v.validate(incomingObject, payloadSchema).valid;
    if (validSchema) {
        let startDatePatternValid = checkDatePattern(incomingObject.startDate);
        let endDatePatternValid = checkDatePattern(incomingObject.endDate);
        if (startDatePatternValid && endDatePatternValid){
            validStatus = 0;
            if(new Date(incomingObject.startDate) > new Date(incomingObject.endDate)){
                validStatus = 2;
            }
            if(incomingObject.minCount > incomingObject.maxCount){
                validStatus = (validStatus === 2) ? 4 : 3;
            }
        }
        else validStatus = 1;
    }
    else {
        validStatus = 1;
    }
    return validStatus;
}

module.exports = {
    validateIncomingRequest
}

