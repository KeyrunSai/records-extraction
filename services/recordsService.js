const RecordsAggregator = require('../components/RecordsAggregator');
const Records = require('../models/record.model');

const getRecords = async (filters) => {
    try {

        let aggregatePipelineArray = RecordsAggregator.generateAggregationPipelineArray(filters);

        if(aggregatePipelineArray !== undefined && aggregatePipelineArray.length > 0){
            const records = await Records.aggregate(aggregatePipelineArray);
            if (records.length > 0) {
                console.log(`Found records: ${records.length}`);
                return records;
            }
            else {
                return [];
            }
        }
        else{
            // Retrun 4 if there is no proper Aggregation pipeline generated to query.
            return [ 4 ];
        }
    } catch (error) {
        console.log(`Error occurred while getting records: ${error.message}`);
        return [ 5 ];
    }
}

module.exports = {
    getRecords
}