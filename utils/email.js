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
    this.from = process.env.EMAIL_FROM
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        logger: true,
        debug: true,
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
        from: `"Tourspage" <${process.env.GMAIL_FROM}>`,
        to: 'tucorreo@gmail.com',
        subject: 'Prueba limpia',
        text: 'Hola Francisco, este es un correo de prueba sin HTML.',
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
