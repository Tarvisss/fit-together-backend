
require('dotenv').config();
const { PORT } = require("./config")
const app = require('./app');

app.listen(PORT, function(){
    console.log(`app running on port ${PORT}`);
});