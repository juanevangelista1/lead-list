'use client';

import { Opportunity } from '@/lib/types';

interface OpportunityTableProps {
	opportunities: Opportunity[];
}

export function OpportunityTable({ opportunities }: OpportunityTableProps) {
	return (
		<div className='bg-white dark:bg-gray-900 rounded-lg shadow-md'>
			{opportunities.length > 0 ? (
				<div className='overflow-x-auto shadow-md sm:rounded-lg'>
					<table className='min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700'>
						<thead className='bg-gray-50 dark:bg-gray-800'>
							<tr>
								<th className='w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Name
								</th>
								<th className='w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Account Name
								</th>
								<th className='w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Stage
								</th>
								<th className='w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Amount
								</th>
							</tr>
						</thead>
						<tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
							{opportunities.map((opp) => (
								<tr key={opp.id}>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
										{opp.name}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
										{opp.accountName}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
										{opp.stage}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
										{opp.amount ? `$${opp.amount.toLocaleString()}` : '-'}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className='flex items-center justify-center h-48'>
					<p className='text-gray-500 dark:text-gray-400'>No opportunities found.</p>
				</div>
			)}
		</div>
	);
}
