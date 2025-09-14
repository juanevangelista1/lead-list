'use client';

import { Lead, Opportunity } from '@/lib/types';
import { LeadDetailPanel } from './leadDetailPanel';
import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

export interface LeadsTableProps {
	leads: Lead[];
	onConvert: (updatedLead: Lead, newOpportunity: Opportunity) => void;
	onSave: (updatedLead: Lead) => void;
	sortOption: 'name' | 'score' | 'status';
	sortDirection: 'asc' | 'desc';
	onSort: (option: 'name' | 'score' | 'status') => void;
}

export function LeadsTable({
	leads,
	onSave,
	onConvert,
	sortOption,
	sortDirection,
	onSort,
}: LeadsTableProps) {
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

	const handleRowClick = (lead: Lead) => {
		setSelectedLead(lead);
	};

	const handleClosePanel = () => {
		setSelectedLead(null);
	};

	const SortIcon = ({ column }: { column: 'name' | 'score' | 'status' }) => {
		if (sortOption !== column) {
			return <ChevronsUpDown className='w-4 h-4 ml-1 text-gray-400' />;
		}
		return sortDirection === 'asc' ? (
			<ChevronUp className='w-4 h-4 ml-1' />
		) : (
			<ChevronDown className='w-4 h-4 ml-1' />
		);
	};

	return (
		<>
			{leads.length > 0 ? (
				<div className='overflow-x-auto shadow-md sm:rounded-lg'>
					<table className='min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700'>
						<thead className='bg-gray-50 dark:bg-gray-800 h-[50px]'>
							<tr>
								<th
									onClick={() => onSort('name')}
									className='cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									<div className='flex items-center'>
										<span>Name</span>
										<SortIcon column='name' />
									</div>
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Company
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Email
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Source
								</th>
								<th
									onClick={() => onSort('status')}
									className='cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									<div className='flex items-center'>
										<span>Status</span>
										<SortIcon column='status' />
									</div>
								</th>
								<th
									onClick={() => onSort('score')}
									className='cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									<div className='flex items-center'>
										<span>Score</span>
										<SortIcon column='score' />
									</div>
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
										{lead.email}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
										{lead.source}
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
				onSave={onSave}
				onConvert={onConvert}
			/>
		</>
	);
}
