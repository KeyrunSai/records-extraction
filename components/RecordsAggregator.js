const generateAggregationPipelineArray = (filters) => {
    let aggregateArray = [];
    try {
        aggregateArray.push({
            $match: {
                createdAt: {
                    $gt: new Date(filters.startDate),
                    $lt: new Date(filters.endDate)
                }
            }
        });
        aggregateArray.push({
            $project: {
                _id: 0,
                key: 1,
                createdAt: 1,
                totalCount: {
                    $sum: '$counts'
                }
            }
        });

        aggregateArray.push({
            $match: {
                totalCount: {
                    $gt: filters.minCount,
                    $lte: filters.maxCount
                }
            }
        });
    } catch (error) {
        console.log(`Error while generating Aggregation pipeline: ${error}`);
        aggregateArray = [];
    }
    return aggregateArray;

}

module.exports = {
    generateAggregationPipelineArray
}