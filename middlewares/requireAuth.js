// Middleware for authentication requirements

// Middleware to require user to be logged in
export const requiredLogin = (req, res, next) => {
    // Check if user is attached to request
    if (!req.user)
        return res.redirect('/login');
    // User is logged in, proceed
    next();
};

// Middleware to require user to be an organiser
export const requiredOrganiser = (req, res, next) => {
    // Check if user is logged in
    if (!req.user)
        return res.redirect('/login');
    // Check if user has organiser role
    if (req.user.role !== 'organiser')
        return res.status(403).redirect('/');
    // User is organiser, proceed
    next();
}
