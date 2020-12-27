const mongoose = require("mongoose")
const db = require("../config/db").dbUrl
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true  },function(err) {
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log("数据库连接成功")
    }
})
mongoose.set('useFindAndModify', false)