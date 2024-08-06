'use server'

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constasts'
import db from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import getSession from '@/lib/session'
import { redirect } from 'next/navigation'

const checkEmailExists = async (email: string) => {
	const user = await db.user.findUnique({
		where: {
			email
		},
		select: {
			id: true
		}
	})
	// if (user) {
	// 	return true
	// }else{
	// 	return false
	// }  == 아래와 동일
	return Boolean(user)
}

const formSchema = z.object({
	email: z
		.string()
		.email()
		.toLowerCase()
		.refine(checkEmailExists, 'An account with this email dows not exists.'),
	password: z.string({
		required_error: 'Password is required'
	})
	//.min(PASSWORD_MIN_LENGTH)
	//.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
})

export async function logIn(prevState: any, formData: FormData) {
	const data = {
		email: formData.get('email'),
		password: formData.get('password')
	}
	const result = await formSchema.spa(data) //spa = saveParseAsync
	if (!result.success) {
		return result.error.flatten()
	} else {
		// find a user with the email
		const user = await db.user.findUnique({
			where: {
				email: result.data.email
			},
			select: {
				id: true,
				password: true
			}
		})
		// compare : 위에서 입력값과 db의 비밀번호를 비교
		// user?.password 에서 !로 바꿈,
		//현재 상황에서는 비밀번호가 무조건 있기 때문에 ts를 위해 빈 문자열과 임의 비교
		const ok = await bcrypt.compare(result.data.password, user!.password ?? '')
		if (ok) {
			const session = await getSession()
			session.id = user!.id
			await session.save()
			redirect('/profile')
		} else {
			return {
				fieldErrors: {
					password: ['Wrong Password'],
					email: []
				}
			}
		}
		// if the user is found, check password hash
		// log the user in
		// redirect "/profile"
	}
}
