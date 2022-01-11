const { validateIncomingRequest } = require('../components/validateIncomingRequest');

describe('Validate all possible scenarios of request payload', () => {
    it('should pass validation test', () => {
        let requestPayload = {
            startDate: '2021-01-01',
            endDate: '2021-12-01',
            minCount: 200,
            maxCount: 500
        };
        let validateStatus = validateIncomingRequest(requestPayload);
        expect(validateStatus).toBe(0);
    })
    it('should not process if the request payload is invalid', () => {
        let requestPayload = {
            startDate: '2022-01-01',
            endDate: 'Jan 20 2022',
            minCount: "200",
            maxCount: 500
        };
        let validateStatus = validateIncomingRequest(requestPayload);
        expect(validateStatus).toBe(1);
    })
    it('should not process if startDate is more than endDate', () => {
        let requestPayload = {
            startDate: '2022-01-01',
            endDate: '2021-12-01',
            minCount: 200,
            maxCount: 500
        };
        let validateStatus = validateIncomingRequest(requestPayload);
        expect(validateStatus).toBe(2);
    })
    it('should not process if minCount is more than maxCount', () => {
        let requestPayload = {
            startDate: '2021-01-01',
            endDate: '2022-12-01',
            minCount: 1200,
            maxCount: 500
        };
        let validateStatus = validateIncomingRequest(requestPayload);
        expect(validateStatus).toBe(3);
    })
    it('should not process if startDate is more than endDate & minCount is more than maxCount', () => {
        let requestPayload = {
            startDate: '2022-01-01',
            endDate: '2021-12-01',
            minCount: 1200,
            maxCount: 500
        };
        let validateStatus = validateIncomingRequest(requestPayload);
        expect(validateStatus).toBe(4);
    })
})