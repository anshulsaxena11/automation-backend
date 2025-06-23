const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

const sendEmail = async(to,subject,text,html=null)=>{
    try{
        const info = await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:process.env.Recived_Email,
            subject,
            text,
            html
        })
        console.log('Email send',info)
    }catch(error){
        console.log(error)
    }
}

module.exports={
    sendEmail
}