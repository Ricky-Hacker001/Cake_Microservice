const multer = require("multer");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"src/cake_Images")
    },
    filename:(req,file,cb)=>{
        const uniqueFilename=Date.now()+"-"+file.originalname;
        cb(null,uniqueFilename)
    }
})

const upload = multer({storage});

module.exports = upload;