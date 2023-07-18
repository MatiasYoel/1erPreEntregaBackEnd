import { generateToken } from '../config/config.jwt.js'

const gitHubCallBack = (req, res) => {
    try {
        console.log(req.user, 'Llama gitHubCallBack');
        const user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            role: req.user.role,
            id: req.user.id,
            email: req.user.email,
            cart: req.user.carts[0]
        }
        console.log(user, 'Llama gitHubCallBack 0');

        const access_token = generateToken(user)
        
        return res.cookie('autenticacion', access_token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            
        }).sendSuccessGitHub('Logueado')
    } catch (error) {
        return res.sendInternalError(error);
    }

}

const loginPost = async (req, res) => {
    try {

        const user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            role: req.user.role,
            id: req.user.id,
            email: req.user.email,
            cart: req.user.cart
        }
        console.log(user)
        const access_token = generateToken(user)

        return res.cookie('autenticacion', access_token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            
        }).sendSuccess('Logueado')
    } catch (error) {
        return res.sendInternalError(error);
    }

}

const registerPost = async (req, res) => {
    try {
        res.sendSuccess('Usuario registrado')
    } catch (error) {
        return res.sendInternalError(error);
    }
}

const postLogOut = (req, res) => {

    try {
        return res.clearCookie('autenticacion').sendSuccess('Cierra Sesion')
    } catch (error) {
        return res.sendInternalError(error);
    }
}

const currentSession = (req, res) => {
    try {
        return res.sendSuccess(req.user);

    } catch (error) {
        return res.sendInternalError(error);
    }
}

export default {
    gitHubCallBack,
    loginPost,
    registerPost,
    postLogOut,
    currentSession,
}