'use server'
export async function handleForm(prevState: any, formData: FormData) {
	console.log(prevState)
	await new Promise((res) => setTimeout(res, 5000))
	return {
		errors: ['worrdng', 'ps too short']
	}
}
