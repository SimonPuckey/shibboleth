const delay = (ms) => {
    const startTime = Date.now();
    let nowTime = Date.now();
    while(nowTime - startTime < ms){
        nowTime = Date.now();
    }
};

exports.delay;

//TODO: require ddb rather than arg?
exports.checkTableReady = (dynamodb, tableNameParam) => new Promise(async (resolve,reject)=>{
    console.log('in check table name', tableNameParam);
    let tableDesc;
    let tableStatus;
    while(tableStatus !== 'ACTIVE') {
        tableDesc = await dynamodb.describeTable(tableNameParam).promise();
        tableStatus = tableDesc.Table.TableStatus;
        tableStatus !== 'ACTIVE' && delay(5000);
    }
    resolve();
});

/*TODO:
> convenience obj for defining table schema & funcs for setting createParams and saveParams
> convenience func for getting value from dynDb query res
*/