const multer = require("multer");
const path = require("path");

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/images");
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.fieldname+path.extname(file.originalname));
    }
})

module.exports= multer({storage:storage})