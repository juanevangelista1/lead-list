'use client';

import Link from 'next/link';
import { Tab } from '@/app/page';
import { Tabs, TABS } from './tabs';
import { useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useClickOutside } from '@/app/hooks/useClickOutside';

interface HeaderProps {
	activeTab: Tab;
	setActiveTab: (tab: Tab) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useClickOutside(menuRef, () => setIsMenuOpen(false));

	const handleTabClick = (tab: Tab) => {
		setActiveTab(tab);
		setIsMenuOpen(false);
	};

	return (
		<header
			ref={menuRef}
			className='sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm'>
			<div className='container flex mx-auto h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
				<Link
					href='/'
					className='flex items-center space-x-2 font-bold text-lg'>
					Mini Seller Console
				</Link>

				<div className='hidden md:flex'>
					<Tabs
						activeTab={activeTab}
						setActiveTab={handleTabClick}
					/>
				</div>

				<div className='md:hidden'>
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className='relative h-6 w-6'>
						<Menu
							className={`absolute top-1 h-6 w-6 transition-all duration-300 ease-in-out ${
								isMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
							}`}
						/>
						<X
							className={`absolute top-1 h-6 w-6 transition-all duration-300 ease-in-out ${
								isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
							}`}
						/>
					</button>
				</div>
			</div>

			<div
				className={`md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
					isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
				}`}>
				<div className='container flex flex-col space-y-2 py-4 px-4 sm:px-6 lg:px-8'>
					{TABS.map((tab) => (
						<button
							key={tab}
							onClick={() => handleTabClick(tab)}
							className={`py-2 px-1 text-left font-semibold text-sm transition-colors duration-200 ${
								activeTab === tab
									? 'text-indigo-500'
									: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
							}`}>
							{tab}
						</button>
					))}
				</div>
			</div>
		</header>
	);
}
