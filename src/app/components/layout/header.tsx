'use client';

import Link from 'next/link';
import { Tab } from '@/app/page';
import { Tabs, TABS } from './tabs';
import { useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useClickOutside } from '@/app/hooks/useClickOutside';
import { ThemeToggle } from './themeToggle';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

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
			className='sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm'>
			<div className='container flex mx-auto h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
				<Link
					href='/'
					className='flex items-center space-x-2 font-bold text-lg text-foreground'>
					{APP_NAME}
				</Link>

				<div className='hidden md:flex items-center space-x-2'>
					<Tabs
						activeTab={activeTab}
						setActiveTab={handleTabClick}
					/>
				</div>

				<div className='md:hidden flex items-center space-x-2'>
					<ThemeToggle />
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className='relative h-6 w-6 text-muted-foreground'
						aria-label='Toggle menu'>
						{isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
					</button>
				</div>
			</div>

			<div
				className={cn(
					'md:hidden bg-background border-t border-border overflow-hidden transition-all duration-300 ease-in-out',
					isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
				)}>
				<div className='container flex flex-col space-y-2 py-4 px-4 sm:px-6 lg:px-8'>
					{TABS.map((tab) => (
						<button
							key={tab}
							onClick={() => handleTabClick(tab)}
							className={cn(
								'py-2 px-1 text-left font-semibold text-sm transition-colors duration-200',
								activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
							)}>
							{tab}
						</button>
					))}
				</div>
			</div>
		</header>
	);
}
