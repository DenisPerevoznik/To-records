const { Router } = require("express");
const router = Router();
const auth = require('../middleware/auth.middleware');
const User = require("../models/User");

router.get('/get-user/:id', auth, async (req, res) => {

    try {
        
        const id = req.params.id;
        const user = await User.findById(id);

        res.json({user});

    } catch (error) {
        res.status(500).json({message: "😥 Oops... something went wrong, try again"});
    }
});

module.exports = router;