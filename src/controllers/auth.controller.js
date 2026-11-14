/**
 * Authentication Controller
 * PT. Jaya Kedhaton Enterprise System
 */

const { REGISTERED_USERS } = require('../config/users');
const { addAuditLog } = require('../middlewares/auth');
const { renderLogin } = require('../views/layout');

function handleLoginSubmit(req, res, clientIp) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const params = new URLSearchParams(body);
        const u = (params.get('username') || '').trim();
        const p = params.get('password') || '';

        const userFound = REGISTERED_USERS.find(usr =>
            usr.username.toLowerCase() === u.toLowerCase() && usr.pass === p
        );
        if (userFound) {
            addAuditLog(userFound.username, 'LOGIN', 'Berhasil login ke sistem melalui Portal Keamanan', clientIp);
            res.writeHead(302, {
                'Set-Cookie': `auth_user=${encodeURIComponent(userFound.username)}; Path=/; HttpOnly`,
                'Location': '/dashboard'
            });
            res.end();
        } else {
            addAuditLog(u || 'UNKNOWN', 'LOGIN_GAGAL', 'Percobaan login gagal dengan kata sandi salah', clientIp);
            res.writeHead(302, {
                'Location': '/login?error=invalid'
            });
            res.end();
        }
    });
}

function handleLoginView(req, res, query) {
    let errMsg = '';
    if (query.error === 'invalid') errMsg = 'Username atau kata sandi tidak cocok. Silakan coba lagi.';
    res.writeHead(200);
    res.end(renderLogin(errMsg));
}

function handleLogout(req, res, currentUser, clientIp) {
    if (currentUser) {
        addAuditLog(currentUser.username, 'LOGOUT', 'Keluar dari sistem', clientIp);
    }
    res.writeHead(302, {
        'Set-Cookie': 'auth_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax',
        'Location': '/login'
    });
    res.end();
}

module.exports = {
    handleLoginSubmit,
    handleLoginView,
    handleLogout
};
