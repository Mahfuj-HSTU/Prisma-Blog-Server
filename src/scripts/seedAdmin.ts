import { prisma } from '../lib/prisma'
import { UserRole } from '../middlewares/auth'

async function seedAdmin() {
	try {
		//! data should to keep in .env file
		const adminData = {
			name: 'Admin',
			email: 'rmahfujur@gmail.com',
			password: 'admin123',
			role: UserRole.ADMIN
		}
		// check user exist or not
		const existingUser = await prisma.user.findUnique({
			where: {
				email: adminData.email
			}
		})
		if (existingUser) {
			throw new Error('Admin already exists')
		}
		const signUpAdmin = await fetch(
			'http://localhost:5000/api/auth/sign-up/email',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(adminData)
			}
		)
		if (signUpAdmin.ok) {
			await prisma.user.update({
				where: {
					email: adminData.email
				},
				data: {
					role: UserRole.ADMIN,
					emailVerified: true
				}
			})
		}
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

seedAdmin()
