'use client';

import { useState, useEffect, useRef } from 'react';
import { Lead, LeadStatus, Opportunity } from '@/lib/types';
import { leadService } from '../../services/leadServiceAPI';
import { opportunityService } from '../../services/opportunityService';
import { validateEmail } from '@/lib/utils';
import { useClickOutside } from '@/app/hooks/useClickOutside';
import { Label } from '@/app/components/ui/label';
import { Loader2, X, Pencil, XCircle, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';

interface LeadDetailPanelProps {
	lead: Lead | null;
	onClose: () => void;
	onSave: (updatedLead: Lead) => void;
	onConvert: (updatedLead: Lead, newOpportunity: Opportunity) => void;
}

const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Archived'];

export function LeadDetailPanel({ lead, onClose, onSave, onConvert }: LeadDetailPanelProps) {
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [editedEmail, setEditedEmail] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<LeadStatus>('New');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

	const panelRef = useRef<HTMLDivElement>(null);
	const statusDropdownRef = useRef<HTMLDivElement>(null);

	useClickOutside(panelRef, onClose);
	useClickOutside(statusDropdownRef, () => setIsStatusDropdownOpen(false));

	useEffect(() => {
		if (lead) {
			setEditedEmail(lead.email);
			setSelectedStatus(lead.status);
			setError('');
			setIsEditingEmail(false);
		}
	}, [lead]);

	const handleSave = async () => {
		if (!lead) return;

		if (!validateEmail(editedEmail)) {
			setError('Invalid email format.');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const updatedLead = await leadService.updateLead(lead.id, {
				email: editedEmail,
				status: selectedStatus,
			});
			onSave(updatedLead);
			toast.success('Lead updated successfully!');
			onClose();
		} catch (e: unknown) {
			const errorMessage = e instanceof Error ? e.message : 'Failed to save changes.';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleConvert = async () => {
		if (!lead) return;

		if (lead.status === 'Opportunity') {
			toast.warn('Lead is already an Opportunity.');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const newOpportunity = await opportunityService.createOpportunityFromLead(lead);
			const updatedLead = await leadService.updateLeadStatus(lead.id, 'Opportunity');
			onConvert(updatedLead, newOpportunity);
			toast.success('Lead converted to Opportunity!');
			onClose();
		} catch (e: unknown) {
			const errorMessage = e instanceof Error ? e.message : 'Failed to convert lead.';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleStatusChange = (status: LeadStatus) => {
		setSelectedStatus(status);
		setIsStatusDropdownOpen(false);
	};

	const isPanelOpen = !!lead;
	const isChanged = lead ? editedEmail !== lead.email || selectedStatus !== lead.status : false;

	return (
		<>
			<div
				onClick={onClose}
				className={`fixed h-full inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${
					isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}></div>

			<div
				ref={panelRef}
				className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
					isPanelOpen ? 'translate-x-0' : 'translate-x-full'
				}`}>
				{lead && (
					<>
						<div className='flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
							<div className='flex flex-col'>
								<h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>{lead.name}</h2>
								<p className='text-sm text-gray-500 dark:text-gray-400'>{lead.company}</p>
							</div>
							<button
								onClick={onClose}
								className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-md transition-colors duration-200'>
								<X className='h-5 w-5' />
							</button>
						</div>
						<div className='p-6 overflow-y-auto flex-1 space-y-6'>
							<div className='flex flex-col space-y-2'>
								<Label
									htmlFor='email'
									className='text-gray-500 dark:text-gray-400'>
									Email
								</Label>
								{isEditingEmail ? (
									<div className='flex items-center space-x-2'>
										<input
											id='email'
											type='email'
											name='email'
											value={editedEmail}
											onChange={(e) => setEditedEmail(e.target.value)}
											className='inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200 w-full justify-between'
										/>
										<button
											onClick={() => setIsEditingEmail(false)}
											disabled={isLoading}
											className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1'>
											<XCircle className='h-4 w-4' />
											<span>Cancel</span>
										</button>
									</div>
								) : (
									<div className='flex items-center justify-between'>
										<p className='text-base font-medium'>{lead.email}</p>
										<button
											onClick={() => setIsEditingEmail(true)}
											disabled={isLoading}
											className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1'>
											<Pencil className='h-4 w-4' />
											<span>Edit</span>
										</button>
									</div>
								)}
							</div>
							<div className='flex flex-col space-y-2'>
								<Label
									htmlFor='status'
									className='text-gray-500 dark:text-gray-400'>
									Status
								</Label>
								<div
									className='relative w-full'
									ref={statusDropdownRef}>
									<button
										onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
										disabled={isLoading}
										className='inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200 w-full justify-between'>
										<span>{selectedStatus}</span>
										<SlidersHorizontal className='h-4 w-4 text-gray-500' />
									</button>
									{isStatusDropdownOpen && (
										<div className='absolute top-full right-0 mt-2 min-w-full rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10'>
											<div
												className='py-1'
												role='menu'
												aria-orientation='vertical'>
												{LEAD_STATUSES.map((status) => (
													<button
														key={status}
														onClick={() => handleStatusChange(status)}
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
							<div className='flex flex-col space-y-2'>
								<Label className='text-gray-500 dark:text-gray-400'>Score</Label>
								<p className='text-base font-medium'>{lead.score}</p>
							</div>
							<div className='flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-2 mt-6'>
								<button
									onClick={handleConvert}
									disabled={isLoading || lead.status === 'Opportunity'}
									className='cursor-pointer flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-gray-300 h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'>
									{isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Convert Lead'}
								</button>
							</div>
							{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
						</div>
						<div className='flex flex-col gap-2 items-stretch p-6 border-t border-gray-200 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between'>
							<button
								onClick={handleSave}
								disabled={isLoading || !isChanged}
								className={`flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-gray-300 h-10 px-4 py-2 ${
									isChanged
										? 'bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90'
										: 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 '
								}`}>
								{isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Save Changes'}
							</button>
							<button
								onClick={onClose}
								disabled={isLoading}
								className='mt-2 sm:mt-0 flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-gray-300 h-10 px-4 py-2 bg-transparent text-gray-900 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700'>
								Cancel
							</button>
						</div>
					</>
				)}
			</div>
		</>
	);
}
