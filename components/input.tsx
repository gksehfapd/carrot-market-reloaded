import { InputHTMLAttributes } from 'react'

interface InputProps {
	name: string
	errors?: string[]
}

export default function Input({
	name,
	errors = [],
	...rest
}: // ...rest : 이외 prop들 사용
InputProps & InputHTMLAttributes<HTMLInputElement>) {
	// InputProps & InputHTMLAttributes<HTMLInputElement> :
	// interface에서 선언한 prop이외 input이 받을 수 있는 모든 attributes또한 받을 수 있게 함
	return (
		<div className='flex flex-col gap-2'>
			<input
				name={name}
				className='bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4
                ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 transition'
				{...rest}
			/>
			{errors?.map((error, index) => (
				<span key={index} className='text-red-500 font-medium'>
					{error}
				</span>
			))}
		</div>
	)
}
