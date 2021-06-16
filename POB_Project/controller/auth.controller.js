const Account = require('../models/account.model')
const Currentuser = require('../controller/account.check')

module.exports.GetLogin = async (req, res) => {
    const { username } = req.signedCookies
    if (username) { // check xem cookie còn hiệu lực hay không
        const account = await Account.findOne({ username }) // tìm tài khoản đang đăng nhập
        res.cookie('username', username, { signed: true, maxAge: 3 * 60 * 60 * 1000 }) // 3 giờ // set lại timelife
        req.user = { username: account.username, role: account.role } // set người dùng hiện tại vào request
        res.redirect('/index') // quay lại trang sách
        return
    } else { // trường hợp cookie hết hiệu lực
        res.render('auth/login') // in ra trang đăng nhập
        return
    }
}

module.exports.GetRegister = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res)
    res.render('auth/register', { username : acc })
    return
}

module.exports.GetLogout = (req, res) => {
    req.session = null
    res.clearCookie('username')
    res.redirect('/login')
}

module.exports.PostLogin = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res) // lấy tên người dùng hiện tại
    const { username, password, fromUrl } = req.body  // lấy giá trị username, password người dùng nhập
    const messages = [];
    const account = await Account.findOne({ username }) // lấy thông tin tài khoản theo username
    // Kiểm tra username tồn tại
    if (account != null) {
        // Kiểm tra password
        if (account.password !== password) {
            messages.push(`Username or password is wrong!`)
        }
    } else {
        // Khi account == null
        messages.push(`Username or password is wrong!`)
    }

    if (messages.length > 0) { 
        res.render('auth/login', { messages })
        return
    } else { 
        res.cookie('username', username, { signed: true, maxAge: 3 * 60 * 60 * 1000 }) // 3 giờ // set lại timelife cho cookie
        req.user = { username: username, role: account.role } // set người dùng đang đăng nhập vào request

        if (account.role == 'admin') {
            res.redirect('/admin')
            return
        }
        
        if (fromUrl) {
            res.redirect(fromUrl)
        } else {
            res.redirect('/index')
            return
        }
    }
}

module.exports.PostRegister = async (req, res) => {
    const acc = await Currentuser.getCurrentUser(req, res)
    const data = req.body
    const { username, password, name, phone, classs } = data
    const messages = []

    if (!username) {
        messages.push('Username field is empty!')
    } 
    if (!password) {
        messages.push('Password field is empty!')
    } 
    if (!name) {
        messages.push('Name field is empty!')
    } 
    if (!phone) {
        messages.push('Phone field is empty!')
    }
    if (!classs) {
        messages.push('Class field is empty!')
    }

    const account = await Account.findOne({ username })

    // Kiểm tra username tồn tại
    if (account != null) {
        messages.push('Username already existed!')
    }

    if (messages.length > 0) {
        res.render('auth/register', { messages : messages, username: acc })
        return
    } else {
        const newAcc = await new Account(req.body)
        newAcc.save()
        res.cookie('username', username, { signed: true, maxAge: 3 * 60 * 60 * 1000 }) // 3 giờ
        req.body = { username: username, role: newAcc.role }
        res.redirect('/index')
        return
    }
}