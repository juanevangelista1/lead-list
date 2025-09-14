'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { LeadList } from './components/leads/leadList';
import { OpportunityTable } from './components/opportunities/opportunityTable';
import { Lead, Opportunity } from '@/lib/types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
	const [activeTab, setActiveTab] = useState<'Leads' | 'Opportunities'>('Leads');

	useEffect(() => {
		const savedLeads = localStorage.getItem('leads');
		const savedOpportunities = localStorage.getItem('opportunities');
		if (savedLeads) {
			setLeads(JSON.parse(savedLeads));
		}
		if (savedOpportunities) {
			setOpportunities(JSON.parse(savedOpportunities));
		}
	}, []);

	const handleLeadsUpdate = (updatedLeads: Lead[]) => {
		setLeads(updatedLeads);
		localStorage.setItem('leads', JSON.stringify(updatedLeads));
	};

	const handleOpportunitiesUpdate = (updatedOpportunities: Opportunity[]) => {
		setOpportunities(updatedOpportunities);
		localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
	};

	return (
		<div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900'>
			<ToastContainer position='top-right' />
			<Header />
			<main className='container mx-auto flex-1 p-4 sm:p-6 lg:p-8'>
				<div className='flex flex-col space-y-6'>
					<div className='bg-white dark:bg-gray-900 rounded-lg shadow-md p-6'>
						<div className='flex items-center space-x-4 mb-6 border-b border-gray-200 dark:border-gray-800'>
							<button
								onClick={() => setActiveTab('Leads')}
								className={`py-2 px-4 font-semibold text-sm transition-colors duration-200 ${
									activeTab === 'Leads'
										? 'border-b-2 border-indigo-500 text-indigo-500'
										: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
								}`}>
								Leads
							</button>
							<button
								onClick={() => setActiveTab('Opportunities')}
								className={`py-2 px-4 font-semibold text-sm transition-colors duration-200 ${
									activeTab === 'Opportunities'
										? 'border-b-2 border-indigo-500 text-indigo-500'
										: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
								}`}>
								Opportunities
							</button>
						</div>
						{activeTab === 'Leads' && (
							<LeadList
								leads={leads}
								setLeads={handleLeadsUpdate}
								setOpportunities={handleOpportunitiesUpdate}
								opportunities={opportunities}
							/>
						)}
						{activeTab === 'Opportunities' && <OpportunityTable opportunities={opportunities} />}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
