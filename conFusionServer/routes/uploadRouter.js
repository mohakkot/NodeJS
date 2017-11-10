const express = require('express');
const bodyparser = require('body-parser');
const uploadRouter = express.Router();
const multer = require("multer");
const authenticate = require('../authenticate');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (res, file,cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error("You can only upload Image Files"), false);
    }
    else{
        return cb(null, true);
    }
}

const upload = multer({storage: storage, fileFilter: imageFileFilter});

uploadRouter.use(bodyparser.json());
uploadRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
});

module.exports = uploadRouter;