import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { APP_NAME, APP_DESCRIPTION, APP_BASE_URL } from '@/lib/constants';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	metadataBase: new URL(APP_BASE_URL),
	title: {
		default: APP_NAME,
		template: `%s | ${APP_NAME}`,
	},
	description: APP_DESCRIPTION,
	manifest: '/manifest.json',
	colorScheme: 'dark light',
	openGraph: {
		title: APP_NAME,
		description: APP_DESCRIPTION,
		url: APP_BASE_URL,
		siteName: APP_NAME,
		type: 'website',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: APP_DESCRIPTION,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: APP_NAME,
		description: APP_DESCRIPTION,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
