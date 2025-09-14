'use client';

import { useRef, useState } from 'react';
import { Label } from '@/app/components/ui/label';
import { SlidersHorizontal, Search } from 'lucide-react';
import { useClickOutside } from '@/app/hooks/useClickOutside';
import { LeadStatus } from '@/lib/types';

const LEAD_FILTER_STATUS: (LeadStatus | 'All')[] = [
	'All',
	'New',
	'Contacted',
	'Qualified',
	'Opportunity',
	'Archived',
];

interface LeadListControlsProps {
	searchTerm: string;
	filterStatus: LeadStatus | 'All';
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onFilterChange: (status: LeadStatus | 'All') => void;
}

export function LeadListControls({
	searchTerm,
	filterStatus,
	onSearchChange,
	onFilterChange,
}: LeadListControlsProps) {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);

	useClickOutside(filterRef, () => setIsFilterOpen(false));

	const handleFilterSelect = (status: LeadStatus | 'All') => {
		onFilterChange(status);
		setIsFilterOpen(false);
	};

	return (
		<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
			<div className='relative w-full sm:max-w-xs'>
				<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
					<Search className='w-4 h-4 text-gray-500 dark:text-gray-400' />
				</div>
				<Label
					htmlFor='search-bar'
					className='sr-only'>
					Search
				</Label>
				<input
					type='text'
					id='search-bar'
					name='search-bar'
					value={searchTerm}
					onChange={onSearchChange}
					className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
					placeholder='Search by name or company...'
				/>
			</div>
			<div
				className='relative flex items-center'
				ref={filterRef}>
				<button
					onClick={() => setIsFilterOpen(!isFilterOpen)}
					className='flex-1 inline-flex items-center space-x-2 px-9 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200 min-w-[150px]'>
					<SlidersHorizontal className='h-4 w-4 text-gray-500' />
					<span>{filterStatus}</span>
				</button>
				{isFilterOpen && (
					<div className='absolute top-full right-0 mt-2 min-w-[150px] rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10'>
						<div
							className='py-1'
							role='menu'
							aria-orientation='vertical'>
							{LEAD_FILTER_STATUS.map((status) => (
								<button
									key={status}
									onClick={() => handleFilterSelect(status)}
									className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
									role='menuitem'>
									{status}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
