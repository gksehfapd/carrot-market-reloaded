import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

// 세션이 필요할때마다 아래 함수를 작성할수 없어서 컴포넌트로 만듦

interface SessionContent {
	id?: number
}

export default function getSession() {
	console.log(cookies())
	return getIronSession<SessionContent>(cookies(), {
		cookieName: 'delicious-karrot',
		password: process.env.COOKIE_PASSWORD!
	})
}
