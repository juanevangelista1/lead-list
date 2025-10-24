'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button
				className='p-2 rounded-md'
				disabled>
				<div className='w-5 h-5 bg-muted rounded-full animate-pulse' />
			</button>
		);
	}

	const isDark = theme === 'dark';

	return (
		<button
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className='p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors'
			aria-label={isDark ? 'Activate light mode' : 'Activate dark mode'}>
			{isDark ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
		</button>
	);
}
