import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { LeadList } from './components/leads/leadList';

export default function Home() {
	return (
		<div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900'>
			<Header />
			<main className='container mx-auto flex-1 p-4 sm:p-6 lg:p-8'>
				<h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>Leads</h1>
				<LeadList />
			</main>
			<Footer />
		</div>
	);
}
