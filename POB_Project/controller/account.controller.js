const Account = require('../models/account.model')

module.exports.findAll = async (req, res) => {
    const listAccount = Account.find() 
    res.end(`<h1>${listAccount}</h1>`)
}