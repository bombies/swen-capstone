import { Geist } from 'next/font/google';
import Link from 'next/link';

const geist = Geist({
	subsets: ['latin'],
	variable: '--font-geist',
});

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={`${geist.variable} min-h-screen bg-background font-sans`}>
			<div className="container relative flex min-h-screen flex-col items-center justify-center">
				<Link
					href="/"
					className="absolute left-4 top-4 md:left-8 md:top-8"
				>
					<span className="text-2xl font-bold">One Yaad</span>
				</Link>
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					{children}
				</div>
			</div>
		</div>
	);
}
