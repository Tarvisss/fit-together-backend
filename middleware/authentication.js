const jwt = require('jsonwebtoken')
/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if(error) return res.sendStatus(403);
        req.user = user;
        next();
    })
    
}


module.exports = {authenticateToken};

