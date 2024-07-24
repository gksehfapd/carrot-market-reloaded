'use client'

import { useFormStatus } from 'react-dom'

interface FormButtonProps {
	text: string
}

export default function FormButton({ text }: FormButtonProps) {
	// pending은 form의 하위 요소에만 사용 가능하다
	const { pending } = useFormStatus()

	return (
		<button
			disabled={pending}
			className='primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed'
		>
			{pending ? 'Loading...' : text}
		</button>
	)
}
