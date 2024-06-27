
export const gitAuth =  async (req, res)=>{}


export const callbackGit = async (req, res) => {
    try {
        // Verificar si req.user existe
        if (!req.user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Verificar si req.session existe
        if (!req.session) {
            return res.status(500).json({ error: 'Session not initialized' });
        }

        req.session.user = req.user;
        res.setHeader('Content-Type', 'application/json');
        return res.redirect('/productos');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};