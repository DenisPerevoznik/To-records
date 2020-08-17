const express = require('express');
const config = require('config');
const mongo = require('mongoose');
const colors = require("colors");

const app = express();
const PORT = config.get('port') || 5000;

app.use(express.static("uploads"));
app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/notepad', require('./routes/notepad.routes'));
app.use('/api/notepad', require('./routes/record.routes'));
app.use('/api/profile', require('./routes/profile.routes'));

mongo.connect(config.get('mongoUri'));

// mongo.connection.on("connected", ()=>{
//     console.log(colors.green("Подключение к базе данных установлено =)"));
    
// });

if(config.get("isProduction")){
    app.use(express.static(path.join(__dirname, '/client/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/client/build'))
    })
}

mongo.connection.on('error', (error) => {

    console.log(colors.red("=( Ошибка подключения к базе данных: "), error);
});

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));

