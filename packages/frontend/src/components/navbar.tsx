import type { FC } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useLogout } from '@/api-utils/hooks/auth.hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

const Navbar: FC = () => {
	const { user } = useAuth();
	const { mutate: logout, isPending: isLoggingOut } = useLogout();

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				{/* Brand */}
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-2xl font-bold">One Yaad</span>
				</Link>

				{/* Search Bar */}
				<div className="flex-1 max-w-2xl mx-8">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products, catalogues, and more..."
							className="w-full pl-10"
						/>
					</div>
				</div>

				{/* User Management */}
				{user
					? (
							<div>
								hey user
								<Button
									loading={isLoggingOut}
									onClick={() => logout({ refreshToken: '' })}
								>
									Logout
								</Button>
							</div>
						)
					: (
							<div className="flex items-center space-x-4">
								<Button variant="ghost" asChild>
									<Link href="/auth/login">Sign In</Link>
								</Button>
								<Button asChild>
									<Link href="/auth/register">Get Started</Link>
								</Button>
							</div>
						)}

			</div>
		</nav>
	);
};

export default Navbar;
