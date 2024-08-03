'use server'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constasts'
import db from '@/lib/db'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const checkUniqueUsername = async (username: string) => {
	const user = await db.user.findUnique({
		where: {
			username
		},
		select: {
			id: true
		}
	})
	return !Boolean(user)
}

const checkUniqueEmail = async (email: string) => {
	const user = await db.user.findUnique({
		where: { email },
		select: {
			id: true
		}
	})
	return !Boolean(user)
}

const formSchema = z
	.object({
		username: z
			.string({
				invalid_type_error: 'Username must be a string!',
				required_error: 'Where is my username???'
			})
			.min(3, 'Way too short!!!')
			//.max(10, "That is too looooong!")
			.trim()
			.toLowerCase()
			//.transform((username) => `🔥 ${username}`)
			// // refine : 특정 조건에 따라 데이터를 검증하기 위해 사용
			.refine((username) => !username.includes('potato'), 'No potatoes allowed!')
			.refine(checkUniqueUsername, 'This username is already taken'),
		email: z
			.string()
			.email()
			.toLowerCase()
			.refine(checkUniqueEmail, 'There is an account already registered with that email'),
		password: z.string({ required_error: 'Password is required' }).min(PASSWORD_MIN_LENGTH),
		//.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
		confirm_password: z.string().min(4)
	})
	.superRefine(({ password, confirm_password }, ctx) => {
		if (password !== confirm_password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Two passwords should be equal',
				path: ['confirm_password']
			})
		}
	})
export async function createAccount(prevState: any, formData: FormData) {
	const data = {
		username: formData.get('username'),
		email: formData.get('email'),
		password: formData.get('password'),
		confirm_password: formData.get('confirm_password')
	}

	const result = await formSchema.safeParseAsync(data)
	if (!result.success) {
		console.log(result.error)
		return result.error.flatten()
	} else {
		// hash password - 비밀번호 변환
		const hashedPassword = await bcrypt.hash(result.data.password, 12)

		// save the user to db
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

		// log the user in = 사용자에게 쿠키를 제공
		// cookies() : 유저의 쿠키를 가져오는 next 내장 함수
		// iron-session : 쿠키를 만들고, 브라우저에 보내는 등의 작업을 대신 해줌
		const cookie = await getIronSession(cookies(), {
			cookieName: 'delicious-karrot',
			password: process.env.COOKIE_PASSWORD!
		})

		//@ts-ignore
		cookie.id = user.id

		await cookie.save()

		redirect('/profile')
	}
}
