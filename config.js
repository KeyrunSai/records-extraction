const env = require('dotenv').config();

module.exports = {
    getPort : () => {
        return (process.env.PORT || 8080);
    },
    getDBURL : () => {
        return (process.env.MONGODB_URL || 'mongodb+srv://dbUser:<pwd>@cluster-ID.mongodb.net/case-study?retryWrites=true');
    }
}