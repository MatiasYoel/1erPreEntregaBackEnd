import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(user, 'jwtSecret', {expiresIn:'24h'});
}

export const authToken = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    console.log(authHeader, 'authHeader');
    if(!authHeader) return res.status(401).send({error: 'Not authenticated'});
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: 'Not authorized'});

        req.user = credentials.user;
        console.log('estoy en next');
        next();
    });
}