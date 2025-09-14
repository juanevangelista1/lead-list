'use client';

import { useState } from 'react';
import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { LeadList } from './components/leads/leadList';
import { OpportunityTable } from './components/opportunities/opportunityTable';
import { Lead } from '@/lib/types';

export default function Home() {
	const [leadsUpdated, setLeadsUpdated] = useState(0);

	const handleLeadsUpdate = (updatedLead: Lead) => {
		setLeadsUpdated((prev) => prev + 1);
		console.log('Lead updated:', updatedLead);
	};

	return (
		<div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900'>
			<Header />
			<main className='container mx-auto flex-1 p-4 sm:p-6 lg:p-8'>
				<h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>Leads</h1>
				<LeadList
					key={`leads-${leadsUpdated}`}
					onLeadUpdate={handleLeadsUpdate}
				/>
				<h1 className='text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white'>Opportunities</h1>
				<OpportunityTable
					key={`opportunities-${leadsUpdated}`}
					opportunities={[]}
				/>
			</main>
			<Footer />
		</div>
	);
}
