'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Lead, Opportunity, LeadStatus } from '@/lib/types';
import { leadService } from '@/app/services/leadServiceAPI';
import { useLocalStorage } from './useLocalStorage';
import useDebounce from './useDebounce';

type SortOption = 'name' | 'score' | 'status';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export function useLeads(
	initialLeads: Lead[],
	setLeads: (leads: Lead[]) => void,
	initialOpportunities: Opportunity[],
	setOpportunities: (opportunities: Opportunity[]) => void
) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const [searchTerm, setSearchTerm] = useLocalStorage('leadSearchTerm', '');
	const [filterStatus, setFilterStatus] = useLocalStorage<LeadStatus | 'All'>(
		'leadFilterStatus',
		'All'
	);
	const [sortOption, setSortOption] = useLocalStorage<SortOption>('leadSortOption', 'score');
	const [sortDirection, setSortDirection] = useLocalStorage<SortDirection>(
		'leadSortDirection',
		'desc'
	);

	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	useEffect(() => {
		if (initialLeads.length > 0) {
			setIsLoading(false);
			return;
		}

		async function fetchLeads() {
			try {
				const fetchedLeads = await leadService.fetchLeads();
				setLeads(fetchedLeads);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to fetch leads.';
				setError(message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchLeads();
	}, [initialLeads, setLeads]);

	const filteredAndSortedLeads = useMemo(() => {
		return [...initialLeads]
			.filter((lead) => {
				const searchTermLower = debouncedSearchTerm.toLowerCase();
				const matchesSearch =
					lead.name.toLowerCase().includes(searchTermLower) ||
					lead.company.toLowerCase().includes(searchTermLower);
				const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
				return matchesSearch && matchesStatus;
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
	}, [initialLeads, debouncedSearchTerm, filterStatus, sortOption, sortDirection]);

	const totalPages = Math.ceil(filteredAndSortedLeads.length / ITEMS_PER_PAGE);
	const paginatedLeads = filteredAndSortedLeads.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const handlePageChange = useCallback(
		(page: number) => {
			if (page >= 1 && page <= totalPages) {
				setCurrentPage(page);
			}
		},
		[totalPages]
	);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
			setCurrentPage(1);
		},
		[setSearchTerm]
	);

	const handleFilterChange = useCallback(
		(status: LeadStatus | 'All') => {
			setFilterStatus(status);
			setCurrentPage(1);
		},
		[setFilterStatus]
	);

	const handleSort = useCallback(
		(option: SortOption) => {
			if (sortOption === option) {
				setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
			} else {
				setSortOption(option);
				setSortDirection('asc');
			}
		},
		[sortOption, setSortDirection, setSortOption]
	);

	const handleSaveLead = useCallback(
		(updatedLead: Lead) => {
			const newLeads = initialLeads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
			setLeads(newLeads);
		},
		[initialLeads, setLeads]
	);

	const handleConvertLead = useCallback(
		(convertedLead: Lead, newOpportunity: Opportunity) => {
			const newLeads = initialLeads.map((l) => (l.id === convertedLead.id ? convertedLead : l));
			setLeads(newLeads);
			setOpportunities([...initialOpportunities, newOpportunity]);
		},
		[initialLeads, initialOpportunities, setLeads, setOpportunities]
	);

	return {
		isLoading,
		error,
		paginatedLeads,
		filteredLeadsCount: filteredAndSortedLeads.length,
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
	};
}
