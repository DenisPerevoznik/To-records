const express = require('express');
const config = require('config');
const mongo = require('mongoose');
const colors = require("colors");
const path = require('path');
const app = express();
const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : config.get('port');

app.use(express.static("uploads"));
app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/notepad', require('./routes/notepad.routes'));
app.use('/api/notepad', require('./routes/record.routes'));
app.use('/api/profile', require('./routes/profile.routes'));

if(process.env.NODE_ENV === "production"){
    app.use('/', express.static(path.join(__dirname, "client", "build")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

mongo.connect(config.get('mongoUri'));

// mongo.connection.on("connected", ()=>{
//     console.log(colors.green("Подключение к базе данных установлено =)"));
    
// });

mongo.connection.on('error', (error) => {

    console.log(colors.red("=( Ошибка подключения к базе данных: "), error);
});

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));

