const mongoose = require('mongoose');

const userRoleModel = new mongoose.Schema({
    roleId: {
        type: String,
        required: true
    },
    roleName: {
        type: String,
        required: true
    }
});

const UserRole = mongoose.model('userRoles', userRoleModel);
module.exports = UserRole;