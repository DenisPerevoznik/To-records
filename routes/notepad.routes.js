const {Router} = require('express');
const Notepad = require('../models/Notepad');
const router = Router();
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth.middleware');
const config = require('config');
const fs = require('fs');
const User = require('../models/User');
const smiles = require('../custom_modules/SmileGenerator');

// CREATE
router.post('/create', [
    check('name', "'Name' field, required to fillable").isString().not().isEmpty(),
    check('description', "Description must not exceed 60 characters").isLength({max: 60}),
    auth
], async(req, res) => {

    try {
        
        const errors = validationResult(req);

        if(!errors.isEmpty()){

            return res.status(400).json({errors: errors.array(), 
                message: "🤔 Check the correctness of the entered data"});
        }

        const {image, name, description} = req.body;
        
        const notepad = new Notepad({image, name, description, records: [], accessUsers: [], owner: req.user.userId});
        await notepad.save();

        res.status(201).json({message: "👏 Notepad created!"});

    } catch (error) {
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

//GET ALL
router.get('/', auth, async (req, res) => {

    try {
        
        const notepads = await Notepad.find({owner: req.user.userId});
        res.json(notepads);

    } catch (error) {
        
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

// GET ONE
router.get('/get/:id', auth, async (req, res) => {

    try {
        const id = req.params.id;
        
        const notepad = await Notepad.findOne({_id: id});

        if(!notepad){
            return res.status(404).json({message: "👨‍💻 Could not find the notebook you want"});
        }

        res.status(200).json(notepad);

    } catch (error) {
        // res.status(500).json({message: error.message});
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.delete('/remove/:id', auth, async (req, res) => {

    try {
        
        const id = req.params.id;
        
        const notepad = await Notepad.findById(id);
        
        // remove access in users
        for (const userId of notepad.accessUsers) {
            
            const user = await User.findById(userId);

            if(user){
                const removeIndex = user.availableNotepads.findIndex(notepadId => notepadId == id);
                user.availableNotepads.splice(removeIndex, 1);
                await user.save();
            }
        }

        if(!notepad){
            return res.status(400).json({message: "🤔 The notebook to be deleted was not found, try again"});
        }

        await Notepad.deleteOne({_id: id});

        res.status(200).json({message: "👌 Notepad delete successfully"});

    } catch (error) {
        // res.status(500).json({message: error});
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
})

router.post('/edit/:id', [
    check('name', "'Name' field, required to fillable").isString().not().isEmpty(),
    check('description', "Description must not exceed 60 characters").isLength({max: 60}),
    auth], async (req, res) => {

    try {
        
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({message: "🤔 Check the correctness of the entered data"});
        }

        const {image, name, description} = req.body;
        const id = req.params.id;
        const notepad = await Notepad.findOne({_id: id});

        if(!notepad){

            return res.status(404).json({message: "😥 No editable notebook found"});
        }

        notepad.image = image;
        notepad.name = name;
        notepad.description = description;
        notepad.save();

        res.status(200).json({message: "👌 Notepad editing successfuly"});

    } catch (error) {
        
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.get('/backgrounds/:imagesType', auth, async (req, res) => {

    try {

        const imagesType = req.params.imagesType;

        fs.readdir(config.get('imagesPath') + `/${imagesType}`, (err, files) => {

            if(err) {
                return res.status(400).json({message: "Failed to load images"});
            }
            
            res.status(200).json(files);
        });
    } catch (error) {
        // res.status(500).json({message: error});
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.post('/get-user-by-email', auth, async (req, res) => {

    try {
        
        const {email, currentUserId} = req.body;
        
        const foundUser = await User.findOne({email});

        if(foundUser && foundUser._id != currentUserId){
            return res.json({user: foundUser});
        }

        res.json({user: null});

    } catch (error) {
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.get('/get-access-users/:notepadId', auth, async (req, res) => {

    try {
        
        const notepadId = req.params.notepadId;
        
        const notepad = await Notepad.findOne({_id: notepadId});
        const users = [];

        for (const userId of notepad.accessUsers) {
            
            const user = await User.findById(userId);

            if(user)
                users.push(user);
        }

        res.json({users});
        
    } catch (error) {
        // res.status(500).json({message: "😥 Oops... something went wrong, try again"});
        res.status(500).json({message: error.message});
    }
});

router.post('/open-access', auth, async (req, res) => {

    try {
        
        const {userId, notepadId} = req.body;

        const user = await User.findOne({_id: userId});
        const notepad = await Notepad.findOne({_id: notepadId});

        notepad.accessUsers.push(userId);
        user.availableNotepads.push(notepadId);

        await notepad.save();
        await user.save();

        res.json({message: `${smiles.generate("good")} The user ${user.name} has been granted access to the "${notepad.name}" notepad`});

    } catch (error) {
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.get('/remove-access/:userId/:notepadId', auth, async (req, res) => {

    try {
        
        const userId = req.params.userId;
        const notepadId = req.params.notepadId;

        const notepad = await Notepad.findById(notepadId);
        const user = await User.findById(userId);

        const removedIndexNotepad = notepad.accessUsers.findIndex(id => id == userId);
        const removeIndexUser = user.availableNotepads.findIndex(id => id == notepadId);

        notepad.accessUsers.splice(removedIndexNotepad, 1);
        user.availableNotepads.splice(removeIndexUser, 1);
        await user.save();
        await notepad.save();

        res.json({message: `User ${user.name} no longer has access to the "${notepad.name}" notepad`});

    } catch (error) {
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.get('/available/:userId', auth, async (req, res) => {

    try {
        
        const userId = req.params.userId;

        const notepads = await Notepad.find({accessUsers: userId});

        res.json({notepads});

    } catch (error) {
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

module.exports = router;