'use client'

import Button from '@/components/button'
import Input from '@/components/input'
import { useFormState } from 'react-dom'
import { smsVerification } from './actions'

export default function SMSLogin() {
	const [state, dispatch] = useFormState(smsVerification, null)
	return (
		<div className='flex flex-col gap-10 py-8 px-6'>
			<div className='flex flex-col gap-2 *:font-medium'>
				<h1 className='text-2xl'>SMS Log in</h1>
				<h2 className='text-xl'>Verify your phone number.</h2>
			</div>
			<form action={dispatch} className='flex flex-col gap-3'>
				<Input type='number' placeholder='Phone number' required name='phone' />
				<Input type='number' placeholder='Verification code' required name='token' />
				<Button text='Verify' />
			</form>
		</div>
	)
}
