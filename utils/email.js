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
    this.from = 'noreply@mailersend.net'
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return nodemailer.createTransport({
        host: 'smtp.mailersend.net',
        port: '587',
        auth: {
          user: process.env.MAILERSEND_USERNAME,
          pass: process.env.MAILERSEND_PASSWORD,
        },
      })
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    }
  }

  async send(template, subject) {
    // Send the actual email

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    })

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    }

    await this.newTransport().sendMail(mailOptions)
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
