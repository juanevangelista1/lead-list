'use client';

import { useState, useEffect, useRef } from 'react';
import { Lead, LeadStatus } from '@/lib/types';
import { leadService } from '@/app/services/leadServiceAPI';
import { LeadsTable } from './leadsTable';
import { Pagination } from './pagination';
import { Label } from '@/app/components/ui/label';
import { SlidersHorizontal } from 'lucide-react';
import useDebounce from '@/app/hooks/useDebounce';

export function LeadList() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState<LeadStatus | 'All'>('All');
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [sortOption, setSortOption] = useState<'name' | 'score'>('name');

	const filterRef = useRef<HTMLDivElement>(null);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
				setIsFilterOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [filterRef]);

	const filteredAndSortedLeads = [...leads]
		.filter((lead) => {
			const matchesSearchTerm =
				lead.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
				lead.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
			const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
			return matchesSearchTerm && matchesStatus;
		})
		.sort((a, b) => {
			if (sortOption === 'name') {
				return a.name.localeCompare(b.name);
			}
			if (sortOption === 'score') {
				return b.score - a.score;
			}
			return 0;
		});

	const totalPages = Math.ceil(filteredAndSortedLeads.length / itemsPerPage);
	const paginatedLeads = filteredAndSortedLeads.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
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

	const leadFilterStatus: (LeadStatus | 'All')[] = [
		'All',
		'New',
		'Contacted',
		'Qualified',
		'Opportunity',
		'Archived',
	];

	return (
		<div className='flex flex-col space-y-6'>
			<div className='bg-white dark:bg-gray-900 rounded-lg shadow-md'>
				<div className='py-8 lg:px-0 sm:px-2 md:px-6'>
					<div className='flex lg:justify-between items-center flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
						<div className='relative w-full sm:max-w-xs'>
							<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
								<svg
									className='w-4 h-4 text-gray-500 dark:text-gray-400'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 20 20'>
									<path
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
									/>
								</svg>
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
							className='relative flex items-center space-x-2'
							ref={filterRef}>
							<button
								onClick={() => setIsFilterOpen(!isFilterOpen)}
								className='min-w-full inline-flex items-center justify-between space-x-2 px-9 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200'>
								<SlidersHorizontal className='h-4 w-4' />
								<span>{filterStatus}</span>
							</button>
							{isFilterOpen && (
								<div className='absolute top-full right-0 mt-2 min-w-full lg:w-[150px] md:w-[100px] sm:w-[100px] rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10'>
									<div
										className='py-1'
										role='menu'
										aria-orientation='vertical'>
										{leadFilterStatus.map((status) => (
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
					<LeadsTable leads={paginatedLeads} />
				) : (
					<div className='flex items-center justify-center h-48'>
						<p className='text-gray-500 dark:text-gray-400'>No leads found.</p>
					</div>
				)}
			</div>
			{filteredAndSortedLeads.length > itemsPerPage && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
