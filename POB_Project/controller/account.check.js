const Account = require('../models/account.model')

module.exports.getCurrentUser = async (req, res) => {
    if (req.user == undefined) {
        return null
    } else {
        return req.user.username
    }
}