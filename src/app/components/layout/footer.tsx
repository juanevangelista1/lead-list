export function Footer() {
	return (
		<footer className='w-full z-50 border-t bg-white/95 backdrop-blur-sm dark:bg-gray-950/95'>
			<div className='container flex h-16 items-center justify-center text-sm text-gray-500'>
				<p>&copy; {new Date().getFullYear()} Mini Seller Console. All rights reserved.</p>
			</div>
		</footer>
	);
}
