import logger from '../config/logger.config.js';

const queryParameterValidators = (req, res, next) => {
    if (req.url.includes('?')) {
        res.setHeader("Cache-Control", "no-store");
        logger.error("No- query Parameters arent allowed");
        return res.status(400).json({ message: "No- query Parameters arent allowed bro" });
    }
    // Call the next middleware or route handler
    next();
}
export default queryParameterValidators;