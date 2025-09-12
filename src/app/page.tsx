import { Header } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { LeadList } from './components/leads/leadList';

export default function Home() {
	return (
		<div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900'>
			<Header />
			<LeadList />
			<Footer />
		</div>
	);
}
