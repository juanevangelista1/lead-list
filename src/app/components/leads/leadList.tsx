'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Lead, LeadStatus, Opportunity } from '@/lib/types';
import { leadService } from '@/app/services/leadServiceAPI';
import { LeadsTable } from './leadsTable';
import { Pagination } from './pagination';
import { Label } from '@/app/components/ui/label';
import { SlidersHorizontal, Search } from 'lucide-react';
import useDebounce from '@/app/hooks/useDebounce';
import { useClickOutside } from '@/app/hooks/useClickOutside';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

interface LeadListProps {
	leads: Lead[];
	setLeads: (updatedLeads: Lead[]) => void;
	opportunities: Opportunity[];
	setOpportunities: (updatedOpportunities: Opportunity[]) => void;
}

const ITEMS_PER_PAGE = 10;
const LEAD_FILTER_STATUS: (LeadStatus | 'All')[] = [
	'All',
	'New',
	'Contacted',
	'Qualified',
	'Opportunity',
	'Archived',
];

export function LeadList({ leads, setLeads, opportunities, setOpportunities }: LeadListProps) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useLocalStorage('leadSearchTerm', '');
	const [filterStatus, setFilterStatus] = useLocalStorage<LeadStatus | 'All'>(
		'leadFilterStatus',
		'All'
	);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOption, setSortOption] = useLocalStorage<'name' | 'score' | 'status'>(
		'leadSortOption',
		'score'
	);
	const [sortDirection, setSortDirection] = useLocalStorage<'asc' | 'desc'>(
		'leadSortDirection',
		'desc'
	);

	const filterRef = useRef<HTMLDivElement>(null);
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	useClickOutside(filterRef, () => setIsFilterOpen(false));

	useEffect(() => {
		if (leads.length > 0) {
			setLoading(false);
			return;
		}

		async function fetchLeads() {
			try {
				const fetchedLeads = await leadService.fetchLeads();
				setLeads(fetchedLeads);
			} catch (e: unknown) {
				const errorMessage = e instanceof Error ? e.message : 'Failed to fetch leads.';
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		}
		fetchLeads();
	}, [leads, setLeads]);

	const filteredAndSortedLeads = useMemo(() => {
		return [...leads]
			.filter((lead) => {
				const searchTermLower = debouncedSearchTerm.toLowerCase();
				const matchesSearchTerm =
					lead.name.toLowerCase().includes(searchTermLower) ||
					lead.company.toLowerCase().includes(searchTermLower);
				const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
				return matchesSearchTerm && matchesStatus;
			})
			.sort((a, b) => {
				const aValue = a[sortOption];
				const bValue = b[sortOption];
				const direction = sortDirection === 'asc' ? 1 : -1;

				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return aValue.localeCompare(bValue) * direction;
				}
				if (typeof aValue === 'number' && typeof bValue === 'number') {
					return (aValue - bValue) * direction;
				}
				return 0;
			});
	}, [leads, debouncedSearchTerm, filterStatus, sortOption, sortDirection]);

	const totalPages = Math.ceil(filteredAndSortedLeads.length / ITEMS_PER_PAGE);
	const paginatedLeads = filteredAndSortedLeads.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const handleFilterChange = (status: LeadStatus | 'All') => {
		setFilterStatus(status);
		setIsFilterOpen(false);
		setCurrentPage(1);
	};

	const handleSort = (option: 'name' | 'score' | 'status') => {
		if (sortOption === option) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortOption(option);
			setSortDirection('asc');
		}
	};

	const handleSaveLead = (updatedLead: Lead) => {
		const newLeads = leads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
		setLeads(newLeads);
	};

	const handleConvertLead = (convertedLead: Lead, newOpportunity: Opportunity) => {
		const newLeads = leads.map((l) => (l.id === convertedLead.id ? convertedLead : l));
		setLeads(newLeads);
		setOpportunities([...opportunities, newOpportunity]);
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
		<div className='flex flex-col space-y-6'>
			<div className='sm:px-2 sm:py-2 md:px-6 lg:py-6 lg:px-0'>
				<div className='flex lg:justify-between items-center flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
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
							onChange={handleSearchChange}
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
											onClick={() => handleFilterChange(status)}
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
			</div>
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
			{filteredAndSortedLeads.length > ITEMS_PER_PAGE && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
