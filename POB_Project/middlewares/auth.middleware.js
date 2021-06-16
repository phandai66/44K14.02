const Account = require('../models/account.model')

// kiểm tra xem người dùng đã đăng nhập hay chưa
module.exports.requireAuth = async (req, res, next) => {
    const { username } = req.signedCookies // check xem cookie có còn hiệu lực không
    if (!username) { // ! có nghĩa là not  !username là not username
        res.render('auth/login', { fromUrl: req.url }) // quay lại trang đăng nhập
        return
    } else { // trường hợp cookie còn hiệu lực
        const account = await Account.findOne({ username }) // tìm ra cái account tương ứng
        req.user = { username: account.username, role: account.role }
        next()
    }
}

module.exports.isUser = async (req, res, next) => {
    const { role } = req.user
    if (role == 'user' || role == 'admin') {
        next()
    } else {
        res.render('auth/cannotAccess')
        return
    }
}

module.exports.justUser = async (req, res, next) => {
    const { role } = req.user
    if (role == 'user') {
        next()
    } else {
        res.render('auth/cannotAccess')
        return
    }
}

module.exports.isAdmin = (req, res, next) => {
    const { role } = req.user
    if (role == 'admin') {
        next()
    } else {
        res.render('auth/cannotAccess')
        return
    }
}

module.exports.checkCookies = async (req, res, next) => {
    const { username } = req.signedCookies
    if (username != null) { // trường hợp cookie còn hiệu lực
        const account = await Account.findOne({ username }) // tương tác với database
        req.user = { username: account.username, role: account.role}
    } else {
        res.clearCookie()
    }
    next()
}