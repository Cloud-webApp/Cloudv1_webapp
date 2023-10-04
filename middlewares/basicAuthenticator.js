import _ from 'lodash';
import db from "../models/index.js";
import bcrypt from "bcryptjs";
export default async (req, res, next) => {

    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (_.isEmpty(authHeader)) {

        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).json({ error: "You are not authorized user" });
    }

    const [username, password] = new Buffer.from(authHeader.split(' ')[1],
        'base64').toString().split(':');

    if (!_.isEmpty(username) && !_.isEmpty(password)) {
        console.log(username, password);

        const salt = await bcrypt.genSalt(10);
        let authUser = await db.users.findOne({
            where: {
                email: username,
            }
        });
        console.log("This is the data value", authUser.dataValues);
        const isMatch = await bcrypt.compare(password, authUser?.password);
        if (!isMatch) {
            res.setHeader('WWW-Authenticate', 'Basic');
            return res.status(401).json({ error: "You are not authorized user" });

        }
        req.authUser = authUser.dataValues;
        delete req.authUser?.password;

    }
    next();
}