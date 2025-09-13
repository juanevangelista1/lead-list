'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/types';
import { leadService } from '@/app/services/leadServiceAPI';
import { LeadsTable } from './leadsTable';
import { Pagination } from './pagination';

export function LeadList() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const itemsPerPage = 10;

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

	// Lógica de busca
	const filteredLeads = leads.filter(
		(lead) =>
			lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			lead.company.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Lógica de Paginação
	const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
	const paginatedLeads = filteredLeads.slice(
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
		setCurrentPage(1); // Reset para a primeira página na busca
	};

	// Estados de UX: Carregando, Erro e Vazio
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
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
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
					<input
						type='text'
						id='search-bar'
						value={searchTerm}
						onChange={handleSearchChange}
						className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						placeholder='Search leads...'
					/>
				</div>
			</div>
			<div className=''>
				{paginatedLeads.length > 0 ? (
					<LeadsTable leads={paginatedLeads} />
				) : (
					<div className='flex items-center justify-center h-48'>
						<p className='text-gray-500 dark:text-gray-400'>Nenhum lead encontrado.</p>
					</div>
				)}
			</div>
			{filteredLeads.length > itemsPerPage && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
