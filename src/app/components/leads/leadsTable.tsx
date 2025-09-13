'use client';

import { Lead } from '@/lib/types';
import { LeadDetailPanel } from './leadDetailPanel';
import { useState } from 'react';

interface LeadsTableProps {
	leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

	const handleRowClick = (lead: Lead) => {
		setSelectedLead(lead);
	};

	const handleClosePanel = () => {
		setSelectedLead(null);
	};

	return (
		<>
			{leads.length > 0 ? (
				<div className='overflow-x-auto shadow-md sm:rounded-lg'>
					<table className='min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700'>
						<thead className='bg-gray-50 dark:bg-gray-800'>
							<tr>
								<th className='w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Name
								</th>
								<th className='w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Company
								</th>
								<th className='w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Status
								</th>
								<th className='w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Score
								</th>
							</tr>
						</thead>
						<tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
							{leads.map((lead) => (
								<tr
									key={lead.id}
									onClick={() => handleRowClick(lead)}
									className='hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200'>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
										{lead.name}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
										{lead.company}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
										{lead.status}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
										{lead.score}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className='flex items-center justify-center h-48'>
					<p>No leads found.</p>
				</div>
			)}
			<LeadDetailPanel
				lead={selectedLead}
				onClose={handleClosePanel}
				onSave={(updatedLead) => {
					// Lógica de salvamento será implementada
					console.log('Lead saved:', updatedLead);
				}}
				onConvert={(leadToConvert) => {
					// Lógica de conversão será implementada
					console.log('Lead converted:', leadToConvert);
				}}
			/>
		</>
	);
}
