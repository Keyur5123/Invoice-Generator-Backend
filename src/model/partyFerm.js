const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true
    },
})

const partyFerms = mongoose.model('PartyFerm',partySchema);

module.exports = partyFerms;