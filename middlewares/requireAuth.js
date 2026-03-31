export const requiredLogin = (req, res, next) => {
    if (!req.user)
        return res.redirect('/login');
    next();
};

export const requiredOrganiser = (req, res, next) => {
    if (!req.user)
        return res.redirect('/login');
    if (req.user.role !== 'organiser')
        return res.status(403).redirect('/');
    next();
}
