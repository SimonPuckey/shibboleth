const keys = require('../../config/keys');
const Store = require('../store');
const store = new Store();
const AWS = require("aws-sdk");
AWS.config.update({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000'
});
const dynamodb = new AWS.DynamoDB();

/*TODO: For now pass table in data op method...
Not sure would want diff table on each save
or couple store to a table
*/
//TODO: and/or setTable method on store
const save = (data, tableName) => new Promise(async (resolve,reject)=>{
    //TODO:
    //tdd
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
});

store.save = save;

const dataTypeMap = {
    string: 'S',
    number: 'N',
    boolean: 'BOOL'
}
const getDataType = (value) => dataTypeMap[typeof(value)];
//Transforms simple item into item to be saved by dynamoDb
const dynamoItemFactory = data => Object.assign(...Object.entries(data).map(([k,v]) => ({[k]: { [getDataType(v)] : v }})));

module.exports = store;

// const itemFac0 = (data) => {
//     const newArray = Object.entries(data).map(([k,v]) => {
//         return {[k]: { [getDataType(v)] : v }};
//     });
//     console.log('new array', newArray);
//     const newObj = Object.assign(...newArray);
//     console.log('newobj', newObj);
// };

