import express from "express";
import {
    accountRegister,
    createToken,
    login,
    sendToken,
    verifyToken,
} from "../service/authentication/index.js";
import jwt from "jsonwebtoken";

const authentication = express.Router();

authentication.post("/register", async (req, res) => {
    const { email, password, role } = req.body;
    const result = await accountRegister(email, password, role);
    if (result.payload) {
        const token = await createToken(result.payload._id);
        if (token) {
            const sent = await sendToken(email, token.payload.token);
            console.log(sent);
            res.status(sent.code).json(sent.payload);
        }
    } else {
        console.log(result);
        res.status(result.code).json({
            message: result.message,
            payload: result.payload,
        });
    }
});

authentication.get("/verify/:token", async (req, res) => {
    const { token } = req.params;
    const result = await verifyToken(token);
});

authentication.post("/login", async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const result = await login(usernameOrEmail, password);
    if (result.payload) {
        const authenticateUser = {
            usernameOrEmail: result.payload.Email,
            userId: result.payload._id,
            role: result.payload.Role,
            verify: result.payload.Verify,
        };
        const j = jwt.sign(authenticateUser, process.env.SECRET_KEY);
        const response = {
            message: result.message,
            token: j,
            userId: result.payload._id,
            role: result.payload.Role,
            verify: result.payload.Verify,
            email: result.payload.Email,
        };
        return res.status(result.code).send(response);
    }
    res.status(result.code).send(result);
});

export default authentication;
