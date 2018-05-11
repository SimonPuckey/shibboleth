//README: alternative using ES6 extends
const keys = require('../../config/keys');
const Store = require('../store');
const store = new Store();
const AWS = require("aws-sdk");
AWS.config.update({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000'
});
const dynamodb = new AWS.DynamoDB();

const dataTypeMap = {
    string: 'S',
    number: 'N',
    boolean: 'BOOL'
}
const getDataType = (value) => dataTypeMap[typeof(value)];
//Transforms simple item into item to be saved by dynamoDb
const dynamoItemFactory = data => Object.assign(...Object.entries(data).map(([k,v]) => ({[k]: { [getDataType(v)] : v }})));

class DynamoDbStore extends Store {
    save(data, tableName){
        return new Promise(
            async (resolve,reject)=>{
                const params = {
                    TableName: 'LocalTestTable',//TODO: pass in or define elsewhere?
                    Item: dynamoItemFactory(data)
                  }; 
                  try{
                    await dynamodb.putItem(params).promise();
                    resolve();
                  }catch(e){
                      console.log('in save catch with error: ', e);
                      reject(e);
                  }
            }
        );
    }
}

module.exports = new DynamoDbStore();

