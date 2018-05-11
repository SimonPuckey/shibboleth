const keys = require('../config/keys');

module.exports = (storeKey) => {
    switch (storeKey) {
        case keys.dynamoDb :
            return require('./stores/dynamoDbStore');
            break;
        //NOT IMPL
        case keys.cosmosDb :
            return require('./stores/cosmosDbStore');
            break;
        default :
            return require('./stores/dynamoDbStore')
    }
};