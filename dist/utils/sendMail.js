"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (to, html) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mainOptions = {
        from: "mollabusiness123@gmail.com",
        to: to,
        subject: "[Molla] Reset Password",
        html: html,
    };
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Message sent: " + info.response);
        }
    });
};
exports.sendMail = sendMail;
//# sourceMappingURL=sendMail.js.map