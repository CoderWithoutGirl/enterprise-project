
const {signToken, register, generateRefreshToken, refreshJwtToken, revokeToken} = require('../service/auth.service')

const authenticateControler = {
    login: async (req, res) => {
        const refreshToken = await generateRefreshToken(req.user, req.ip)
        if(req.isAuthenticated()) {
            res.cookie("refresh-token", refreshToken.token, {httpOnly: true});
            res.status(200).json({
                status: 200,
                user: req.user,
                isAuthenticated: true,
                token: signToken(req.user?.username), 
            })
        }
    },
    register: async (req, res) => {
        const registerAccount = req.body;
        try {
            const createAccount = await register(registerAccount);
            res.status(201).json({
                message: "Account registed successfully",
                status: 201,
                account: createAccount,
            });
        } catch (error) {
            res.status(400).json({message: error.message, status: 400});
        }
    },
    refeshToken: async (req, res) => {
        const refreshToken = req.cookies['refresh-token'];
        console.log(refreshToken);
        try {
            const responseData = await refreshJwtToken(refreshToken);
            res.status(200).json({...responseData})

        } catch (error) {
            res.status(400).json({message: error.message, status: 400})
        }
    },
    logout: async (req, res) => {
        const { refreshToken } = req.body;
        try {
            await revokeToken(refreshToken);
            res.clearCookie('refresh-token')
            res.status(200).json({ message: "lougout success", status: 200 });
        } catch (error) {
            res
                .status(400)
                .json({ message: error.message, status: 400 });

        }
    }
}

module.exports = authenticateControler;