'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/types';
import { LeadDetailPanel } from './leadDetailPanel';

// Dados mockados para o desenvolvimento do componente de UI
const MOCKED_LEADS: Lead[] = [
	{
		id: 'lead-1',
		name: 'Maria Silva',
		company: 'Tech Solutions',
		email: 'maria.silva@tech.com',
		source: 'Website',
		score: 95,
		status: 'New',
	},
	{
		id: 'lead-2',
		name: 'João Santos',
		company: 'Innovate Corp',
		email: 'joao.santos@innovate.com',
		source: 'Referral',
		score: 88,
		status: 'Contacted',
	},
	{
		id: 'lead-3',
		name: 'Ana Souza',
		company: 'Global Connect',
		email: 'ana.souza@global.com',
		source: 'Partnership',
		score: 75,
		status: 'Qualified',
	},
];

export function LeadList() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

	useEffect(() => {
		setTimeout(() => {
			try {
				setLeads(MOCKED_LEADS);
				setLoading(false);
			} catch (e: unknown) {
				if (e instanceof Error) {
					setError(e.message);
				} else {
					setError('Failed to load mocked leads.');
				}
				setLoading(false);
			}
		}, 500); // Simula uma latência de 500ms
	}, []);

	const handleRowClick = (lead: Lead) => {
		setSelectedLead(lead);
	};

	const handleClosePanel = () => {
		setSelectedLead(null);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-48'>
				<p>Loading leads...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-48 text-red-500'>
				<p>Error: {error}</p>
			</div>
		);
	}

	return (
		<div>
			{leads.length > 0 ? (
				<table className='min-w-full min-h-[95vh]  table-fixed divide-y divide-gray-200 dark:divide-gray-700'>
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
			) : (
				<div className='flex items-center justify-center h-48'>
					<p>No leads found.</p>
				</div>
			)}
			<LeadDetailPanel
				lead={selectedLead}
				onClose={handleClosePanel}
			/>
		</div>
	);
}
