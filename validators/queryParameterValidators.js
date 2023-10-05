const queryParameterValidators = (req, res, next) => {
    if (req.url.includes('?')) {
        res.setHeader("Cache-Control", "no-store");
        return res.status(400).json({ message: "Query parameters are not allowed" });
    }
    // Call the next middleware or route handler
    next();
}
export default queryParameterValidators;