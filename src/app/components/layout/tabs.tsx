'use client';

import { Tab } from '@/app/page';

export const TABS: Tab[] = ['Leads', 'Opportunities'];

interface TabsProps {
	activeTab: Tab;
	setActiveTab: (tab: Tab) => void;
}

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
	return (
		<div className='flex items-center space-x-4'>
			{TABS.map((tab) => (
				<button
					key={tab}
					onClick={() => setActiveTab(tab)}
					className={`py-2 px-1 font-semibold text-sm transition-colors duration-200 ${
						activeTab === tab
							? 'border-b-2 border-indigo-500 text-indigo-500'
							: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent'
					}`}>
					{tab}
				</button>
			))}
		</div>
	);
}
