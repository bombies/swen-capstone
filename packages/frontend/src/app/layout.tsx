import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'One Yaad Marketplace',
	description: 'The Jamaican Marketplace',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					{/* Navigation Bar */}
					<Navbar />
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
