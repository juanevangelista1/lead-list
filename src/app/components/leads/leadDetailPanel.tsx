'use client';

import { useState, useEffect, useRef } from 'react';
import { Lead, LeadStatus } from '@/lib/types';
import { leadService } from '../../services/leadServiceAPI';
import { validateEmail } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { opportunityService } from '../../services/opportunityService';
import { Label } from '@/app/components/ui/label';

interface LeadDetailPanelProps {
	lead: Lead | null;
	onClose: () => void;
	onSave: (updatedLead: Lead) => void;
	onConvert: (lead: Lead) => void;
}

export function LeadDetailPanel({ lead, onClose, onSave, onConvert }: LeadDetailPanelProps) {
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [editedEmail, setEditedEmail] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead?.status || 'New');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const emailInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (lead) {
			setEditedEmail(lead.email);
			setSelectedStatus(lead.status);
			setError('');
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
			onClose();
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Failed to save changes.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleConvert = async () => {
		if (!lead) return;

		if (lead.status === 'Opportunity') {
			setError('Lead is already an Opportunity.');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			await opportunityService.createOpportunityFromLead(lead);
			const updatedLead = await leadService.updateLeadStatus(lead.id, 'Opportunity');
			onConvert(updatedLead);
			onClose();
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Failed to convert lead to opportunity.');
		} finally {
			setIsLoading(false);
		}
	};

	const isPanelOpen = !!lead;
	const isChanged = editedEmail !== lead?.email || selectedStatus !== lead?.status;

	return (
		<>
			<div
				onClick={onClose}
				className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${
					isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}></div>

			<div
				className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
					isPanelOpen ? 'translate-x-0' : 'translate-x-full'
				}`}>
				<div className='flex flex-col h-full'>
					<div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
						<h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
							{lead?.name || 'Lead Details'}
						</h2>
						<button
							onClick={onClose}
							className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
							&times;
						</button>
					</div>

					<div className='p-4 overflow-y-auto flex-1'>
						<div className='space-y-4 py-4'>
							<div>
								<Label
									htmlFor='company'
									className='text-gray-500 dark:text-gray-400'>
									Company
								</Label>
								<p className='text-base font-medium'>{lead?.company}</p>
							</div>

							<div>
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
											ref={emailInputRef}
											disabled={isLoading}
											className='flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
										/>
										<button
											onClick={() => setIsEditingEmail(false)}
											disabled={isLoading}
											className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
											Cancel
										</button>
									</div>
								) : (
									<div className='flex items-center justify-between'>
										<p className='text-base font-medium'>{lead?.email}</p>
										<button
											onClick={() => setIsEditingEmail(true)}
											disabled={isLoading}
											className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
											Edit
										</button>
									</div>
								)}
							</div>

							<div>
								<Label
									htmlFor='status'
									className='text-gray-500 dark:text-gray-400'>
									Status
								</Label>
								<select
									id='status'
									name='status'
									value={selectedStatus}
									onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
									disabled={isLoading}>
									{['New', 'Contacted', 'Qualified', 'Archived'].map((status) => (
										<option
											key={status}
											value={status}>
											{status}
										</option>
									))}
								</select>
							</div>

							<div>
								<Label className='text-gray-500 dark:text-gray-400'>Score</Label>
								<p className='text-base font-medium'>{lead?.score}</p>
							</div>
						</div>
						{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
					</div>
					<div className='flex flex-col sm:flex-row-reverse sm:justify-start sm:space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 p-4'>
						<button
							onClick={handleSave}
							disabled={isLoading || !isChanged}
							className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-gray-300 h-10 px-4 py-2 ${
								isChanged
									? 'bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90'
									: 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
							}`}>
							{isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Save'}
						</button>
						<button
							onClick={onClose}
							disabled={isLoading}
							className='mt-2 sm:mt-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-gray-300 h-10 px-4 py-2 bg-transparent text-gray-900 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800'>
							Cancel
						</button>
						<button
							onClick={handleConvert}
							disabled={isLoading || lead?.status === 'Opportunity'}
							className='mt-2 sm:mt-0 sm:ml-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-gray-300 h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'>
							{isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Convert to Opportunity'}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
