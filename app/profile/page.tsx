import db from '@/lib/db'
import getSession from '@/lib/session'
import { notFound, redirect } from 'next/navigation'

async function getUser() {
	const session = await getSession()
	if (session.id) {
		const user = await db.user.findUnique({
			where: {
				id: session.id
			}
		})
		if (user) {
			return user
		}
	}
	notFound() //logout을 시도하는 유저가 profile page로 가려 할 때 session id 가 없다면 404 리턴
}

export default async function Profile() {
	const user = await getUser()
	const logOut = async () => {
		'use server'
		const session = await getSession()
		await session.destroy()
		redirect('/')
	}
	return (
		<div>
			<h1>welcome! {user?.username}</h1>

			<form action={logOut}>
				{/* button에 onClick 사용 시  client component를 사용해야 하기에 이렇게 하면 서버에서 처리 가능*/}
				<button>Log out</button>
			</form>
		</div>
	)
}
