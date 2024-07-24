'use client'

import FormButton from '@/components/form-btn'
import FormInput from '@/components/form-input'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import { createAccount } from './actions'

export default function CreateAccount() {
	const [state, action] = useFormState(createAccount, null)
	return (
		<div className='flex flex-col gap-10 py-8 px-6'>
			<div className='flex flex-col gap-2 *:font-medium'>
				<h1 className='text-2xl'>안녕하세요!</h1>
				<h2 className='text-xl'>Fill in the form below to join!</h2>
			</div>
			<form action={action} className='flex flex-col gap-3'>
				<FormInput
					name='username'
					required
					type='text'
					placeholder='Username'
					errors={state?.fieldErrors.username}
				/>
				<FormInput
					name='email'
					required
					type='email'
					placeholder='Email'
					errors={state?.fieldErrors.email}
				/>
				<FormInput
					name='password'
					required
					type='password'
					placeholder='Password'
					errors={state?.fieldErrors.password}
				/>
				<FormInput
					name='confirm_password'
					required
					type='password'
					placeholder='Confirm Password'
					errors={state?.fieldErrors.confirm_password}
				/>
				<FormButton text='Create Account' />
			</form>
			<div className='w-full h-px bg-neutral-500' />
			<div>
				<Link
					className='primary-btn flex h-10 items-center justify-center gap-2'
					href='/sms'
				>
					<span>
						<ChatBubbleOvalLeftEllipsisIcon className='h-6 w-6' />
					</span>
					<span>Sign up with SMS</span>
				</Link>
			</div>
		</div>
	)
}
