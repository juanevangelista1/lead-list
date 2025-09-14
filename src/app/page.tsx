'use client';

import { useState } from 'react';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { LeadList } from './components/leads/leadList';
import { OpportunityTable } from './components/opportunities/opportunityTable';
import { Lead, Opportunity } from '@/lib/types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocalStorage } from './hooks/useLocalStorage';

type Tab = 'Leads' | 'Opportunities';

export default function Home() {
	const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);
	const [opportunities, setOpportunities] = useLocalStorage<Opportunity[]>('opportunities', []);
	const [activeTab, setActiveTab] = useState<Tab>('Leads');

	const TABS: Tab[] = ['Leads', 'Opportunities'];

	return (
		<div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900'>
			<ToastContainer position='top-right' />
			<Header />
			<main className='container mx-auto flex-1 p-4 sm:p-6 lg:p-8'>
				<div className='flex flex-col space-y-6'>
					<div className='bg-white dark:bg-gray-900 rounded-lg shadow-md p-6'>
						<div className='flex items-center space-x-4 mb-6 border-b border-gray-200 dark:border-gray-800'>
							{TABS.map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`py-2 px-4 font-semibold text-sm transition-colors duration-200 ${
										activeTab === tab
											? 'border-b-2 border-indigo-500 text-indigo-500'
											: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
									}`}>
									{tab}
								</button>
							))}
						</div>
						{activeTab === 'Leads' && (
							<LeadList
								leads={leads}
								setLeads={setLeads}
								opportunities={opportunities}
								setOpportunities={setOpportunities}
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
