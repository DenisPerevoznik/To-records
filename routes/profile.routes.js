const { Router } = require("express");
const router = Router();
const auth = require('../middleware/auth.middleware');
const User = require("../models/User");
const smile = require('../custom_modules/SmileGenerator');
const multer = require('multer');
const path = require('path');

const upload = multer({storage: multer.diskStorage({
    destination(req, file, cb){
        cb(null, "uploads/");
    },
    filename(req, file, cb){

        const {userId} = req.body;
        const ext = path.extname(file.originalname);
        cb(null, userId + ext);
    }
})});

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
        return res.json({message: `${smile.generate("good")} Profile photo updated`});
    }
    
    res.status(400).json({message: `${smile.generate("bad")} Photo upload error`});
});

module.exports = router;