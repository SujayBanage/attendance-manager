
const mongoose = require('mongoose');
const CONNECTION  = async()=>{ 

    try{      
        const res = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log('mongodb connection is successful!!! 💯 💯 😄');
    }
    catch(e){
        console.log(`erro occured while mongodb connection : ${e.message}`);
    }

   
}

module.exports = CONNECTION;