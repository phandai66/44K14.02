const Account = require('../models/account.model')
module.exports.loadAdminPage = async (req, res) => {
    if (req.user) {
        const { username } = req.user
        const acc = await Account.findOne({ username }) //lấy ra người dùng hiện tại đang đăng nhập
        res.render('layouts/admin', { username : acc.username })
        return
    } else {
        res.redirect('/login')
        return
    }
}