const dotenv = require('dotenv')
const path = require('path')

const configpath = dotenv.config({ path: path.resolve(__dirname, `../Backend/env/${process.env.NODE_ENV}.env`) })

module.exports = configpath
