'use client'

import Button from '@/components/button'
import Input from '@/components/input'
import { useFormState } from 'react-dom'
import { smsLogin } from './actions'

const initialState = {
	token: false,
	error: undefined
}

export default function SMSLogin() {
	const [state, dispatch] = useFormState(smsLogin, initialState)
	return (
		<div className='flex flex-col gap-10 py-8 px-6'>
			<div className='flex flex-col gap-2 *:font-medium'>
				<h1 className='text-2xl'>SMS Log in</h1>
				<h2 className='text-xl'>Verify your phone number.</h2>
			</div>
			<form action={dispatch} className='flex flex-col gap-3'>
				{state?.token ? (
					<Input
						type='number'
						placeholder='Verification code'
						required
						name='token'
						min={100000}
						max={999999}
					/>
				) : (
					<Input
						type='text'
						placeholder='Phone number'
						required
						name='phone'
						errors={state.error?.formErrors}
					/>
				)}{' '}
				Token
				<Button text={state.token ? 'Verify Token' : 'Send Verification SMS'} />
			</form>
		</div>
	)
}
