const nodemailer=require('nodemailer');
exports.sendEmail=async (options)=>{
    try {
        const transporter=await nodemailer.createTransport({
            service:process.env.SMPT_SERVICE,
            auth:{
                user:process.env.SMPT_MAIL,
                pass:process.env.SMPT_PASSWORD
            }
        })
        console.log("Email of sender: ",process.env.SMPT_MAIL);
        const mailOptions={
            from:process.env.SMPT_MAIL,
            to:options.email,
            subject:options.subject,
            text:options.message
        }
        console.log(mailOptions);
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error);
    }

}