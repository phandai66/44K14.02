const Account = require('../models/account.model')
const Currentuser = require('../controller/account.check')

module.exports.GetLogin = async (req, res) => {
    const { username } = req.signedCookies
    if (username) {
        const account = await Account.findOne({ username })
        res.cookie('username', username, { signed: true, maxAge: 3 * 60 * 60 * 1000 }) // 3 hours
        req.user = { username: account.username, role: account.role }
        res.redirect('/index')
        return
    } else {
        res.render('auth/login')
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
    const acc = await Currentuser.getCurrentUser(req, res)
    const { username, password, fromUrl } = req.body
    const messages = [];
    const account = await Account.findOne({ username })
    // Check username exist
    if (account != null) {
        // Check password
        if (account.password !== password) {
            messages.push(`Username or password is wrong!`)
        }
    } else {
        // When account == null
        messages.push(`Username or password is wrong!`)
    }

    if (messages.length > 0) {
        res.render('auth/login', { messages : messages, username: acc })
        return
    } else {
        res.cookie('username', username, { signed: true, maxAge: 3 * 60 * 60 * 1000 }) // 3 hours 
        req.user = { username: username, role: account.role }


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

    // Check username exist
    if (account != null) {
        messages.push('Username already existed!')
    }

    if (messages.length > 0) {
        res.render('auth/register', { messages : messages, username: acc })
        return
    } else {
        const newAcc = await new Account(req.body)
        newAcc.save()
        res.cookie('username', username, { signed: true, maxAge: 3 * 60 * 60 * 1000 }) // 3 hours
        req.body = { username: username, role: newAcc.role }
        res.redirect('/index')
        return
    }
}