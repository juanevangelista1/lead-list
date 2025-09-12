'use client';

import { Lead } from '@/lib/types';

interface LeadDetailPanelProps {
	lead: Lead | null;
	onClose: () => void;
}

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
	const isPanelOpen = !!lead;

	return (
		<>
			<div
				onClick={onClose}
				className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${
					isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}></div>

			<div
				className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
					isPanelOpen ? 'translate-x-0' : 'translate-x-full'
				}`}>
				<div className='flex flex-col h-full'>
					<div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
						<h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
							{lead?.name || 'Lead Details'}
						</h2>
						<button
							onClick={onClose}
							className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
							&times;
						</button>
					</div>
					<div className='p-4 overflow-y-auto flex-1'>
						<p className='text-gray-600 dark:text-gray-300'>
							This is the Lead Detail Panel for {lead?.name}.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
