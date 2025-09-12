import Link from 'next/link';

export function Header() {
	return (
		<header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm dark:bg-gray-950/95'>
			<div className='container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
				<Link
					href='/'
					className='flex items-center space-x-2 font-bold text-lg'>
					Mini Seller Console
				</Link>
				<nav>{/* Você pode adicionar links de navegação aqui se necessário */}</nav>
			</div>
		</header>
	);
}
