const express = require('express');
const app = express();
const env_config = require('./env_config')
const conn = require('./src/services/common-services/dbConnection');
const billRoute = require("./src/routes/billRoute");
const userRoute = require("./src/routes/userRoute");
const authRoute = require("./src/routes/authRoute");
const productAndPartyRoute = require("./src/routes/productAndPartyRoute");
const cors = require('cors');
const figlet = require('figlet');
require('dotenv').config();

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(express.json())

app.use('/darshan-creation/auth', authRoute)
app.use('/darshan-creation', billRoute)
app.use('/darshan-creation/users', userRoute)
app.use('/darshan-creation/product-and-party', productAndPartyRoute)

app.listen(process.env.PORT, () => {
    figlet.text(`D A R S H A N \nC R E A T I O N  !`, { horizontalLayout: 'default', verticalLayout: 'default', width: 120, whitespaceBreak: true }, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        
        console.log(data);
        console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}.`);
        console.log(`-----------------------------------------------------------------------------------`);
        console.log(`Start Time  : ` + (new Date()).toUTCString());
        console.log(`Environment : ${process.env.ENVIRONMENT}`);
        console.log(`Port        : ${process.env.PORT}`);
        console.log(`-----------------------------------------------------------------------------------`);
    });
})
