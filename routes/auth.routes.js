const {Router} = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const smiles = require('../custom_modules/SmileGenerator');

// /api/auth/register
router.post('/register', 
[
    check('email', `Некоректно введен email`).isEmail(),
    check('password', `Минимальная длина пароля 5 символов`).isLength({min: 5})
],
 async (req, res) => {
    try {
        
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: `${smiles.generate("bad")} ${errors.array()[0].msg}`});
        }

        const {name, email, password, repeatPassword} = req.body;

        if(password !== repeatPassword){
            return res.status(400).json({message: `${smiles.generate("bad")} Пароли не совпадают!`});
        }
        
        const pasport = await User.findOne({email});

        if(pasport){
            return res.status(409).json({message: "🧐 Такой пользователь уже существует"});
        }

        
        const secretPass = await bcrypt.hash(password, 15);
        
        const newUser = new User({name, email, password: secretPass});
        await newUser.save();
        
        res.status(201).json({message: `${smiles.generate("good")} Пользователь успешно создан!`});

    } catch (error) {
        
        // res.status(500).json({message: error.message});
        res.status(500).json({message: "😥 Что-то пошло не так. Попробуйте снова"});
    }
});


router.post('/login', async (req, res) => {

    try {
        
        const {email, password} = req.body;

        const findUser = await User.findOne({email});

        if(findUser){

            const passMatch = await bcrypt.compare(password, findUser.password);

            if(passMatch){

                const token = jwt.sign(
                    {userId: findUser.id},
                    config.get('jwtSecretKey'),
                    {expiresIn: "2 days"}
                );
        
                return res.json({token, userId: findUser.id});
            }
        }
        
        res.status(404).json({message: `${smiles.generate("bad")} Не верные данные для входа!`});

    } catch (error) {
        res.status(500).json({message: "😥 Что-то пошло не так. Попробуйте снова"});
    }
});

module.exports = router;