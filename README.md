# Records Extraction

API to fetch records from MongoDB collection and return the results in a specific format.

## Requirements
- Nodejs (Express framework)

- MongoDB



## Configuration
Add PORT and MONGODB_URL entires to .env file

## Installation and Execution
npm install - to install all the necessary dependencies
npm start - to run API

## API Endpoint
There is only 1 POST API (`/getRecords`) which is responsible to accept request payload (in a specific format) and return results in a specific format.

### Request Payload
The request payload will include a JSON with 4 fields:
- `startDate` and `endDate` fields will contain the date in a `YYYY-MM-DD` format. You should filter the data using `createdAt`
- `minCount` and `maxCount` are for filtering the data. Sum of the `count` array in the documents should be between `minCount` and `maxCount`.

**Sample:**
```json
{
  "startDate": "2016-01-26", 
  "endDate": "2018-02-02",
  "minCount": 2700,
  "maxCount": 3000
}
```

### Response Payload
Response payload should have 3 main fields.
- `code` is for status of the request. 0 means success. Other values may be used for errors that you define.
- `msg` is for description of the code. You can set it to `success` for successful requests. For unsuccessful requests, you should use explanatory messages.
- `records` will include all the filtered items according to the request. This array should include items of `key`, `createdAt` and `totalCount` which is the sum of the `counts` array in the document.

**Sample:**
```json
{
  "code": 0,
  "msg": "Success",
  "records":[
  {
    "key": "*****",
    "createdAt": "2017-01-28T01:22:14.398Z",
    "totalCount": 2800
    },
  ]
}
```

### Other Errors considered to include in the response payload
Apart from `Success` scenarios, there are certain cases where API needs to handle:
- `{ "code": 1, "msg": "Invalid request payload, can't proceed" }`
- `{ "code": 2, "msg": "Invalid request payload: Start date is more than End date" }`
- `{ "code": 3, "msg": "Invalid request payload: Min count is more than Max count" }`
- `{ "code": 4, "msg": "Invalid request payload: Start date is more than End date & Min count is more than Max count" }`
- `{ "code": 5, "msg": "No proper Aggregation pipeline generated to query" }`
- `{ "code": 6, "msg": "Error occured while executing Aggregation pipeline" }`
- `{ "code": 7, "msg": "Error while parsing request payload. Error: .." }`

### Payload Schema
Used `jsonschema` package to validate request payloads. You can find the project's payload schema in the file `request.payload.schema.js`. For the request payload, all the fields mentioned above are mandatory. If there is any field that should be considered optional, this requires change in this schema file and need code changes to handle optional fields.

### Test cases coverage
Go to `__tests__` folder to view the test cases written using Jest framework.

### Deployment
Node.js (Express) app can be deployed to any cloud depending on the needs.
