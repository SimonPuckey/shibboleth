module.exports = class {
    thing = () => 'hey you guys';
    save(data){
        console.log('Please provide an implementation of save');
    }
};

// 

//sooooo ES5
// module.exports = function (){
//     this.iSave = () =>{
//         //try/catch - throw an error
//         console.log('Please provide an implementation of save');
//     }
//     this.save = (data)=> {
//         this.iSave();
//     };
// };

//Pseudo
//e.g. 
//so a dynamo db store would return a new Store()
//but set data op methods before returning to control impl of save (or any other exposed function)
//need a secondary method that represents the impl of 1st method as likely need to adapt call for each impl
//or db specific store could just overwrite save with func that takes data and calls own 'save'