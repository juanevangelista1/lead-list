'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/types';
import { leadService } from '@/app/services/leadServiceAPI';
import { LeadDetailPanel } from './leadDetailPanel';

export function LeadList() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

	useEffect(() => {
		async function fetchLeads() {
			try {
				const fetchedLeads = await leadService.fetchLeads();
				setLeads(fetchedLeads);
			} catch (e: unknown) {
				if (e instanceof Error) {
					setError(e.message);
				} else {
					setError('Failed to fetch leads.');
				}
			} finally {
				setLoading(false);
			}
		}

		fetchLeads();
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
			) : (
				<div className='flex items-center justify-center h-48'>
					<p>No leads found.</p>
				</div>
			)}
			<LeadDetailPanel
				lead={selectedLead}
				onClose={handleClosePanel}
				onSave={(updatedLead) => {
					// Handle save logic here
					setLeads((prevLeads) =>
						prevLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
					);
				}}
				onConvert={(leadToConvert) => {
					// Handle convert logic here
					console.log('Converting lead:', leadToConvert);
				}}
			/>
		</div>
	);
}
