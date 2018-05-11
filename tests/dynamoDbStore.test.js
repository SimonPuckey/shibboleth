//Local imports
const getStore = require('../src/storage/getStore');
const keys = require('../src/config/keys');
const {checkTableReady} = require('./testUtils');

//Utils
const uuidv4 = require('uuid/v4');

//DYNAMODB
const AWS = require("aws-sdk");
AWS.config.update({
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000'
});
const dynamodb = new AWS.DynamoDB();

//TABLE DEFS
const TableName = 'LocalTestTable';
const params = {
    TableName,
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"}  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "S" }//request url or page url
        //TODO: add 'success' and 'message' attribute defs
    ]
    ,
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

let dynamoDbStore;
let data;

describe('dynamoDbStore', () => {
    beforeAll(async ()=>{
        jest.setTimeout(25000);//Still need this? Check table seems a lot quicker now
        //CREATE TABLE
        await dynamodb.createTable(params).promise();
    });
    afterAll(async () =>{
        //DELETE TABLE
        await dynamodb.deleteTable({TableName}).promise();
        //checkTable exists to ensure deleted?
        jest.setTimeout(null); //should reset timeout accord to docs??
    });
    beforeEach(()=>{
        dynamoDbStore = getStore(keys.dynamoDb); //TODO: fresh store on each test?
    });
    describe('save', ()=> {
        describe('given valid data', () => {
            let customerId;
            beforeEach(()=>{
                customerId = uuidv4();
                //SIMPLE CUSTOMER DATA
                data = {
                    [keys.id]: customerId,
                    [keys.firstName]: 'FIRST_NAME',
                    [keys.lastName]: 'LAST_NAME',
                }
            });
            test('it should save the expected item', async () => {
                await checkTableReady(dynamodb, {TableName});
                console.log('before save', dynamoDbStore);
                await dynamoDbStore.save(data);
                //QUERY WITH ID
                const getParams = {
                    TableName,
                    Key: {
                      [keys.id] : {S: customerId} 
                    }
                  };
                const result = await dynamodb.getItem(getParams).promise();
                //TODO:DynDb response obj is bit shit so right a convenience func
                expect(result.Item.firstName.S).toBe('FIRST_NAME'); 
            });
        });
    });
});
