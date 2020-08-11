const express = require('express');
const config = require('config');
const mongo = require('mongoose');
const colors = require("colors");
const smileGenerator = require('./custom_modules/SmileGenerator');

const app = express();
const PORT = config.get('port') || 5000;

app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/notepad', require('./routes/notepad.routes'));
app.use('/api/notepad', require('./routes/record.routes'));

mongo.connect(config.get('mongoUri'));

// mongo.connection.on("connected", ()=>{
//     console.log(colors.green("Подключение к базе данных установлено =)"));
    
// });

mongo.connection.on('error', (error) => {

    console.log(colors.red("=( Ошибка подключения к базе данных: "), error);
});

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));