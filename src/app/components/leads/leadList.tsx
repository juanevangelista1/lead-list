'use client';

import { Lead, Opportunity } from '@/lib/types';
import { useLeads } from '@/app/hooks/useLeads';
import { LeadsTable } from './leadsTable';
import { Pagination } from './pagination';
import { LeadListControls } from './leadListControls';

interface LeadListProps {
	leads: Lead[];
	setLeads: (updatedLeads: Lead[]) => void;
	opportunities: Opportunity[];
	setOpportunities: (updatedOpportunities: Opportunity[]) => void;
}

const ITEMS_PER_PAGE = 10;

export function LeadList({ leads, setLeads, opportunities, setOpportunities }: LeadListProps) {
	const {
		isLoading,
		error,
		paginatedLeads,
		filteredLeadsCount,
		currentPage,
		totalPages,
		searchTerm,
		filterStatus,
		sortOption,
		sortDirection,
		handlePageChange,
		handleSearchChange,
		handleFilterChange,
		handleSort,
		handleSaveLead,
		handleConvertLead,
	} = useLeads(leads, setLeads, opportunities, setOpportunities);

	if (isLoading) {
		return <div className='flex items-center justify-center h-48'>Loading leads...</div>;
	}

	if (error) {
		return <div className='flex items-center justify-center h-48 text-red-500'>Error: {error}</div>;
	}

	return (
		<div className='flex flex-col space-y-6'>
			<LeadListControls
				searchTerm={searchTerm}
				filterStatus={filterStatus}
				onSearchChange={handleSearchChange}
				onFilterChange={handleFilterChange}
			/>

			{paginatedLeads.length > 0 ? (
				<LeadsTable
					leads={paginatedLeads}
					onSave={handleSaveLead}
					onConvert={handleConvertLead}
					sortOption={sortOption}
					sortDirection={sortDirection}
					onSort={handleSort}
				/>
			) : (
				<div className='flex items-center justify-center h-48'>
					<p className='text-gray-500 dark:text-gray-400'>No leads found.</p>
				</div>
			)}

			{filteredLeadsCount > ITEMS_PER_PAGE && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
