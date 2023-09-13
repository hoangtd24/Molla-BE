import nodemailer from "nodemailer"; // khai báo sử dụng module nodemailer
export const sendMail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    // config mail server
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mainOptions = {
    // thiết lập đối tượng, nội dung gửi mail
    from: "mollabusiness123@gmail.com",
    to: to,
    subject: "[Molla] Reset Password",
    html: html,
  };
  transporter.sendMail(mainOptions, function (err: any, info: any) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};
