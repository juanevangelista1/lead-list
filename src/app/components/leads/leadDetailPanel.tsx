'use client';

import { useState, useEffect, useRef } from 'react';
import { Lead, LeadStatus, Opportunity } from '@/lib/types';
import { leadService } from '../../services/leadServiceAPI';
import { opportunityService } from '../../services/opportunityService';
import { validateEmail } from '@/lib/utils';
import { useClickOutside } from '@/app/hooks/useClickOutside';
import { Label } from '@/app/components/ui/label';
import { Loader2, X, SlidersHorizontal, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { EditableField } from '../ui/editableField';
import { cn } from '@/lib/utils';
import { LEAD_STATUS_OPTIONS } from '@/lib/constants';

interface LeadDetailPanelProps {
	lead: Lead | null;
	onClose: () => void;
	onSave: (updatedLead: Lead) => void;
	onConvert: (updatedLead: Lead, newOpportunity: Opportunity) => void;
}

const PanelHeader = ({
	leadName,
	company,
	onClose,
}: {
	leadName: string;
	company: string;
	onClose: () => void;
}) => (
	<div className='flex items-start justify-between p-6 border-b border-border'>
		<div className='flex flex-col'>
			<h2 className='text-2xl font-semibold text-foreground'>{leadName}</h2>
			<p className='text-sm text-muted-foreground'>{company}</p>
		</div>
		<button
			onClick={onClose}
			className='text-muted-foreground hover:text-foreground p-2 rounded-md transition-colors duration-200'>
			<X className='h-5 w-5' />
		</button>
	</div>
);

const StatusSelector = ({
	selectedStatus,
	onStatusChange,
	isLoading,
}: {
	selectedStatus: LeadStatus;
	onStatusChange: (status: LeadStatus) => void;
	isLoading: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	useClickOutside(dropdownRef, () => setIsOpen(false));

	return (
		<div
			className='relative w-full'
			ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				disabled={isLoading}
				className='inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-foreground bg-background border border-input rounded-lg hover:bg-muted transition-colors duration-200 w-full justify-between'>
				<span>{selectedStatus}</span>
				<SlidersHorizontal className='h-4 w-4 text-muted-foreground' />
			</button>
			{isOpen && (
				<div className='absolute top-full right-0 mt-2 min-w-full rounded-md bg-background shadow-lg ring-1 ring-border z-10'>
					<div
						className='py-1'
						role='menu'
						aria-orientation='vertical'>
						{LEAD_STATUS_OPTIONS.map((status) => (
							<button
								key={status}
								onClick={() => {
									onStatusChange(status);
									setIsOpen(false);
								}}
								className='flex items-center justify-between w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted'
								role='menuitem'>
								{status}
								{selectedStatus === status && <Check className='h-4 w-4' />}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const PanelFooter = ({
	onClose,
	onSave,
	isLoading,
	isChanged,
}: {
	onClose: () => void;
	onSave: () => void;
	isLoading: boolean;
	isChanged: boolean;
}) => (
	<div className='flex flex-col gap-2 items-stretch p-6 border-t border-border lg:flex-row lg:items-center lg:justify-between'>
		<button
			onClick={onClose}
			disabled={isLoading}
			className={cn(
				'flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed h-10 px-4 py-2',
				'bg-transparent text-foreground hover:bg-muted border border-input'
			)}>
			Cancel
		</button>
		<button
			onClick={onSave}
			disabled={isLoading || !isChanged}
			className={cn(
				'flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed h-10 px-4 py-2',
				'bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground'
			)}>
			{isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Save Changes'}
		</button>
	</div>
);

export function LeadDetailPanel({ lead, onClose, onSave, onConvert }: LeadDetailPanelProps) {
	const [editedEmail, setEditedEmail] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(LeadStatus.New);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const panelRef = useRef<HTMLDivElement>(null);
	useClickOutside(panelRef, onClose);

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
			const msg = 'Invalid email format.';
			setError(msg);
			toast.error(msg);
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
			const msg = e instanceof Error ? e.message : 'Failed to save changes.';
			console.error('[LeadDetailPanel] Error saving lead:', msg, e);
			setError(msg);
			toast.error(msg);
		} finally {
			setIsLoading(false);
		}
	};

	const handleConvert = async () => {
		if (!lead) return;
		if (lead.status === LeadStatus.Opportunity) {
			toast.warn('Lead is already an Opportunity.');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const newOpportunity = await opportunityService.createOpportunityFromLead(lead);
			const updatedLeadData = { ...lead, status: LeadStatus.Opportunity };
			await leadService.updateLead(lead.id, {
				status: LeadStatus.Opportunity,
			});
			onConvert(updatedLeadData, newOpportunity);
			toast.success('Lead converted to Opportunity!');
			onClose();
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Failed to convert lead.';
			console.error('[LeadDetailPanel] Error converting lead:', msg, e);
			setError(msg);
			toast.error(msg);
		} finally {
			setIsLoading(false);
		}
	};

	const isPanelOpen = !!lead;
	const isChanged = lead ? editedEmail !== lead.email || selectedStatus !== lead.status : false;

	return (
		<>
			<div
				onClick={onClose}
				className={cn(
					'fixed h-full inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out',
					isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				)}></div>

			<div
				ref={panelRef}
				className={cn(
					'fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
					isPanelOpen ? 'translate-x-0' : 'translate-x-full'
				)}>
				{lead && (
					<>
						<PanelHeader
							leadName={lead.name}
							company={lead.company}
							onClose={onClose}
						/>
						<div className='p-6 overflow-y-auto flex-1 space-y-6'>
							<div className='flex flex-col space-y-2'>
								<Label
									htmlFor='email'
									className='text-muted-foreground'>
									Email
								</Label>
								<EditableField
									label='email'
									initialValue={editedEmail}
									onValueChange={setEditedEmail}
									isLoading={isLoading}
									inputType='email'
								/>
							</div>
							<div className='flex flex-col space-y-2'>
								<Label
									htmlFor='status'
									className='text-muted-foreground'>
									Status
								</Label>
								<StatusSelector
									selectedStatus={selectedStatus}
									onStatusChange={setSelectedStatus}
									isLoading={isLoading}
								/>
							</div>
							<div className='flex flex-col space-y-2'>
								<Label className='text-muted-foreground'>Score</Label>
								<p className='text-base font-medium'>{lead.score}</p>
							</div>
							<div className='flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-2 mt-6'>
								<button
									onClick={handleConvert}
									disabled={isLoading || lead.status === LeadStatus.Opportunity}
									className='flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'>
									{isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Convert Lead'}
								</button>
							</div>
							{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
						</div>
						<PanelFooter
							onClose={onClose}
							onSave={handleSave}
							isLoading={isLoading}
							isChanged={isChanged}
						/>
					</>
				)}
			</div>
		</>
	);
}
