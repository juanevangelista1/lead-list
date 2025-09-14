'use client';

import { useState } from 'react';
import { Pencil, XCircle } from 'lucide-react';

interface EditableFieldProps {
	label: string;
	initialValue: string;
	onValueChange: (newValue: string) => void;
	isLoading: boolean;
	inputType?: string;
}

export function EditableField({
	label,
	initialValue,
	onValueChange,
	isLoading,
	inputType = 'text',
}: EditableFieldProps) {
	const [isEditing, setIsEditing] = useState(false);

	if (!isEditing) {
		return (
			<div className='flex items-center justify-between'>
				<p className='text-base font-medium'>{initialValue}</p>
				<button
					onClick={() => setIsEditing(true)}
					disabled={isLoading}
					className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1'>
					<Pencil className='h-4 w-4' />
					<span>Edit</span>
				</button>
			</div>
		);
	}

	return (
		<div className='flex items-center space-x-2'>
			<input
				id={label}
				type={inputType}
				name={label}
				value={initialValue}
				onChange={(e) => onValueChange(e.target.value)}
				className='inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200 w-full justify-between'
			/>
			<button
				onClick={() => setIsEditing(false)}
				disabled={isLoading}
				className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1'>
				<XCircle className='h-4 w-4' />
				<span>Cancel</span>
			</button>
		</div>
	);
}
