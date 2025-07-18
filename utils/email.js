import { convert } from 'html-to-text'
import nodemailer from 'nodemailer'
import path from 'path'
import pug from 'pug'
import { fileURLToPath } from 'url'

//new Email(user, url).sendWelcome()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const Email = class {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = 'onboarding@resend.dev'
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      })
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      })
    }
  }

  async send(template, subject) {
    // Send the actual email
    try {
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        }
      )

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html),
      }

      const transporter = this.newTransport()
      const info = await transporter.sendMail(mailOptions)
      console.log('✅ Email enviado:', info.response)
    } catch (err) {
      console.error('❌ Error al enviar correo:', err.message)
      console.log('↪️ Detalles:', err)
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!')
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    )
  }
}
