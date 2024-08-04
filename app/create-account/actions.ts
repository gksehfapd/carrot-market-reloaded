'use server'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constasts'
import db from '@/lib/db'
import { redirect } from 'next/navigation'
import getSession from '@/lib/session'

// const checkUniqueUsername = async (username: string) => {
// 	const user = await db.user.findUnique({
// 		where: {
// 			username
// 		},
// 		select: {
// 			id: true
// 		}
// 	})
// 	return !Boolean(user)
// }

// const checkUniqueEmail = async (email: string) => {
// 	const user = await db.user.findUnique({
// 		where: { email },
// 		select: {
// 			id: true
// 		}
// 	})
// 	return !Boolean(user)
// }

// // refine : 특정 조건에 따라 데이터를 검증하기 위해 사용
// // superRefine : refine은 모든 조건을 확인하는데 superRefine은 하나가 걸리면 이후 검색을 멈춤 - db 요청 최소화

const checkUsername = (username: string) => !username.includes('potato')
const checkPasswords = ({
	password,
	confirm_password
}: {
	password: string
	confirm_password: string
}) => password === confirm_password

const formSchema = z
	.object({
		username: z
			.string({
				invalid_type_error: 'Username must be a string!',
				required_error: 'Where is my username???'
			})
			.toLowerCase()
			.trim()
			// .transform((username) => `🔥 ${username} 🔥`)
			.refine(checkUsername, 'No potatoes allowed!'),
		email: z.string().email().toLowerCase(),
		password: z.string().min(PASSWORD_MIN_LENGTH),
		//.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
		confirm_password: z.string().min(PASSWORD_MIN_LENGTH)
	})
	.superRefine(async ({ username }, ctx) => {
		const user = await db.user.findUnique({
			where: {
				username
			},
			select: {
				id: true
			}
		})
		if (user) {
			ctx.addIssue({
				code: 'custom',
				message: 'This username is already taken',
				path: ['username'],
				fatal: true // NEVER와 함께 사용 - superRefine
			})
			return z.NEVER //NEVER를 해줘야 이후 refine이 멈춤 - superRefine
		}
	})
	.superRefine(async ({ email }, ctx) => {
		const user = await db.user.findUnique({
			where: {
				email
			},
			select: {
				id: true
			}
		})
		if (user) {
			ctx.addIssue({
				code: 'custom',
				message: 'This email is already taken',
				path: ['email'],
				fatal: true
			})
			return z.NEVER
		}
	})
	.refine(checkPasswords, {
		message: 'Both passwords should be the same!',
		path: ['confirm_password']
	})
export async function createAccount(prevState: any, formData: FormData) {
	const data = {
		username: formData.get('username'),
		email: formData.get('email'),
		password: formData.get('password'),
		confirm_password: formData.get('confirm_password')
	}
	const result = await formSchema.spa(data)
	if (!result.success) {
		console.log(result.error.flatten())
		return result.error.flatten()
	} else {
		const hashedPassword = await bcrypt.hash(result.data.password, 12)
		const user = await db.user.create({
			data: {
				username: result.data.username,
				email: result.data.email,
				password: hashedPassword
			},
			select: {
				id: true
			}
		})
		const session = await getSession()
		session.id = user.id
		await session.save()
		redirect('/profile')
	}
}
