const { Router } = require("express");
const router = Router();
const auth = require('../middleware/auth.middleware');
const User = require("../models/User");
const smile = require('../custom_modules/SmileGenerator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/heic"|| 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }

const upload = multer({storage: multer.diskStorage({
    destination(req, file, cb){
        cb(null, "uploads/");
    },
    filename(req, file, cb){

        const {userId} = req.body;
        const ext = path.extname(file.originalname);
        cb(null, `${userId}-${Date.now()}${ext}`);
    }
}), fileFilter});

router.get('/get-user/:id', auth, async (req, res) => {

    try {
    
        const id = req.params.id;
        const user = await User.findById(id);

        res.json({user});

    } catch (error) {
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.post('/save-profile', auth, async (req, res) => {

    try {
        
        const reqUser = req.body.user;
        const user = await User.findById(reqUser._id);

        user.name = reqUser.name;
        user.description = reqUser.description;
        user.company = reqUser.company;
        await user.save();

        res.json({message: `${smile.generate("good")} User saved successfully`});

    } catch (error) {
        // res.status(500).json({message: error.message});
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.post('/upload-photo', [auth, upload.single('user-photo')], async (req, res) => {

    const fileData = req.file;

    if(fileData){

        const {userId} = req.body;
        const user = await User.findById(userId);

        if(user.photo != "default.jpg")
            fs.unlink(`./uploads/${user.photo}`, (error) => {

                if(error){
                    console.log(`Error remove user photo: ${error}`.red);
                }
            });

        user.photo = fileData.filename;
        await user.save();

        return res.json({userPhoto: user.photo, message: `${smile.generate("good")} Profile photo updated`});
    }
    
    res.status(400).json({message: `${smile.generate("bad")} Photo upload error`});
});

module.exports = router;