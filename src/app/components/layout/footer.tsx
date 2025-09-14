export function Footer() {
	return (
		<footer className='w-full z-10 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm px-3'>
			<div className='container mx-auto flex h-16 items-center justify-center text-sm text-gray-500 '>
				<p className='text-center'>
					&copy; {new Date().getFullYear()} Mini Seller Console. Developed by Juan Evangelista 🖖🏻. All
					rights reserved.
				</p>
			</div>
		</footer>
	);
}
