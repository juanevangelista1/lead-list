'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { LeadList } from './components/leads/leadList';
import { OpportunityTable } from './components/opportunities/opportunityTable';
import { Lead, Opportunity } from '@/lib/types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocalStorage } from './hooks/useLocalStorage';

export type Tab = 'Leads' | 'Opportunities';

export default function Home() {
	const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);
	const [opportunities, setOpportunities] = useLocalStorage<Opportunity[]>('opportunities', []);
	const [activeTab, setActiveTab] = useLocalStorage<Tab>('activeTab', 'Leads');

	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900'>
			<ToastContainer position='top-right' />
			{isClient ? (
				<>
					<Header
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
					<main className='container mx-auto flex-1 p-4 sm:p-6 lg:p-8'>
						<div className='flex flex-col space-y-6'>
							<div className='bg-white dark:bg-gray-900 rounded-lg shadow-md p-6'>
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
				</>
			) : (
				<div className='flex items-center justify-center h-48'>Loading leads...</div>
			)}

			<Footer />
		</div>
	);
}
