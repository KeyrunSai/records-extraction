const payloadSchema = {
    type: 'object',
    properties: {
        startDate: {
            type: 'string'
        },
        endDate: {
            type: 'string'
        },
        minCount: {
            type: 'number'
        },
        maxCount: {
            type: 'number'
        }
    },
    required: [
        'startDate',
        'endDate',
        'minCount',
        'maxCount'
    ]
};

module.exports = {
    payloadSchema
}