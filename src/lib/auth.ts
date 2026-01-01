import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // Use true for port 465, false for port 587
	auth: {
		user: process.env.APP_USER!,
		pass: process.env.APP_PASS!
	}
})

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql' // or "mysql", "postgresql", ...etc
	}),
	trustedOrigins: [process.env.APP_URL!],
	user: {
		additionalFields: {
			role: { type: 'string', defaultValue: 'USER', required: false },
			phone: {
				type: 'string',
				required: false
			},
			status: {
				type: 'string',
				defaultValue: 'ACTIVE',
				required: false
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url, token }, request) => {
			const verificationsUrl = `${process.env.APP_URL}/verify-email?token=${token}`
			try {
				const info = await transporter.sendMail({
					from: '"prisma blog" <prisma.blog@gmail.com>',
					to: 'rmahfujur16@gmail.com',
					subject: 'Verify your email address',
					text: 'Hello world?', // Plain-text version of the message
					html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Helvetica, Arial, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 16px">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 520px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  padding: 24px;
                  text-align: center;
                  border-bottom: 1px solid #e5e7eb;
                "
              >
                <h1 style="margin: 0; font-size: 22px; color: #111827">
                  Prisma Blog
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px">
                <h2
                  style="
                    margin: 0 0 12px;
                    font-size: 20px;
                    color: #111827;
                  "
                >
                  Verify your email address
                </h2>

                <p style="margin: 0 0 16px; color: #374151; font-size: 15px">
                <br>Hello ${user.name},</br>
                  Thanks for signing up! Please confirm your email address by
                  clicking the button below.
                </p>

                <div style="text-align: center; margin: 28px 0">
                  <a
                    href="${verificationsUrl}"
                    style="
                      display: inline-block;
                      padding: 12px 24px;
                      background-color: #2563eb;
                      color: #ffffff;
                      text-decoration: none;
                      font-weight: 600;
                      border-radius: 6px;
                      font-size: 15px;
                    "
                  >
                    Verify Email
                  </a>
                </div>

                <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px">
                  If the button doesn’t work, copy and paste this link into your
                  browser:
                </p>

                <p
                  style="
                    margin: 0;
                    word-break: break-all;
                    color: #2563eb;
                    font-size: 14px;
                  "
                >
                 ${verificationsUrl}
                </p>

                <p
                  style="
                    margin: 24px 0 0;
                    color: #6b7280;
                    font-size: 14px;
                  "
                >
                  This link will expire in 24 hours. If you didn’t create an
                  account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: center;
                  border-top: 1px solid #e5e7eb;
                  color: #9ca3af;
                  font-size: 12px;
                "
              >
                © 2025 Prisma Blog. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
				})
			} catch (error) {
				console.error(error)
				throw error
			}
		}
	},
	socialProviders: {
		google: {
			prompt: 'select_account consent',
			accessType: 'offline',
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		}
	}
})
