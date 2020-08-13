const Router = require('express');
const Notepad = require('../models/Notepad');
const Record = require('../models/Record');
const router = Router();
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth.middleware');
const config = require('config');
const smile = require('../custom_modules/SmileGenerator');

router.post('/save-record', [ 
    check("record.title", "The maximum title length is no more than 17 characters").isLength({max: 17, min: 1}),
    auth
], async (req, res) => {

    try {
        
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({message: "Некоторые данные введены не верно"});
        }

        const {notepadId} = req.body;
        const requestRecord = req.body.record;

        const notepad = await Notepad.findOne({_id: notepadId});
        const recordIndex = notepad.records.findIndex(record => "" + record._id == requestRecord._id);
        
        notepad.records.set(recordIndex, requestRecord);
        await notepad.save();
        
        res.status(200).json({message: "Record saved successfully"});

    } catch (error) {
        // res.status(500).json({message: error.message});
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.post('/create-record', auth, async (req, res) => {

    try {
        
        const {notepadId} = req.body;
        const notepad = await Notepad.findOne({_id: notepadId});

        const newRecord = new Record({date: new Date()});
        notepad.records.push(newRecord);
        
        await notepad.save();
        res.status(200).json({record: newRecord, message: `${smile.generate('good')} Record created succesfully`});

    } catch (error) {

        // res.status(500).json({message: error.message});
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

router.delete('/remove-record/:notepadId/:recordId', auth, async (req, res) => {

    try {
        
        const recordId = req.params.id;
        const notepadId = req.params.notepadId;

        const notepad = await Notepad.findOne({_id: notepadId});

        const removedRecordIndex = notepad.records.findIndex(record => record._id == recordId);

        notepad.records.splice(removedRecordIndex, 1);
        await notepad.save();

        res.json({records: notepad.records, message: "Remover record successfully"});

    } catch (error) {
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

module.exports = router;