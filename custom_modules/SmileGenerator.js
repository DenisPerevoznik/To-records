
const config = require("config");
const goodSmiles = config.get('goodSmiles');
const badSmiles = config.get('badSmiles');

const smileGenerator = {

    generate: (type) => {
        let maxNumber = 0;
        let randomIndex = 0;
        switch(type){
    
            case "good":

                maxNumber = goodSmiles.length;
                randomIndex = Math.random() * maxNumber;

            return goodSmiles[Math.floor(randomIndex)]; 
    
            case "bad":
                maxNumber = badSmiles.length;
                randomIndex = Math.random() * maxNumber;
            return badSmiles[Math.floor(randomIndex)]; 
    
            default: 
                throw new Error(`Emoticons like ${type} do not exist`);
        }
    }
};

module.exports = smileGenerator;