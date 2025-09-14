export function Footer() {
	return (
		<footer className='w-full z-10 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm '>
			<div className='container flex h-16 items-center justify-center text-sm text-gray-500'>
				<p>
					&copy; {new Date().getFullYear()} Mini Seller Console. Developed by Juan Evangelista 🖖🏻. All
					rights reserved.
				</p>
			</div>
		</footer>
	);
}
