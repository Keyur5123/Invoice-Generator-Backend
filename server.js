const express = require('express');
const app = express();
const conn = require('./src/services/common-services/dbConnection');
const billRoute = require("./src/routes/billRoute");
const authRoute = require("./src/routes/authRoute");
const cors = require('cors');
const figlet = require('figlet');
require('dotenv').config();

app.use(cors({
    origin: ['http://localhost:3000','https://keyur5123-upgraded-space-goggles-rqgr5v6wr9hwp67-3000.preview.app.github.dev'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(express.json())

app.use('/darshan-creation', billRoute)
app.use('/darshan-creation/auth', authRoute)

app.listen(process.env.PORT, () => {
    figlet.text(`D A R S H A N C R E A T I O N  !`, { horizontalLayout: 'default', verticalLayout: 'default', width: 120, whitespaceBreak: true }, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }

        console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}.`);
        console.log(`-----------------------------------------------------------------------------------`);
        console.log(`Start Time  : ` + (new Date()).toUTCString());
        console.log(`Environment : ${process.env.NODE_ENV}`);
        console.log(`Port        : ${process.env.PORT}`);
        console.log(`-----------------------------------------------------------------------------------`);
    });
})
