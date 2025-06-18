'use client';

import type { FC } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useGetAllCarts } from '@/api-utils/hooks/cart.hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserProfile from '@/components/user-profile';
import { useAuth } from '@/hooks/use-auth';

const Navbar: FC = () => {
	const { isAuthenticated } = useAuth();
	const { data: carts } = useGetAllCarts();

	const totalItems = carts?.reduce((sum, cart) => sum + cart.items.length, 0) || 0;

	return (
		<nav className="sticky top-0 z-50 px-12 w-full border-b border-border/10 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/95">
			<div className="container flex h-16 items-center justify-between">
				{/* Brand */}
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-2xl font-bold text-primary-foreground">One Yaad</span>
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
				<div className="flex items-center space-x-4">
					{isAuthenticated && (
						<Button variant="ghost" size="icon" asChild className="relative text-primary-foreground hover:text-foreground">
							<Link href="/carts">
								<ShoppingCart className="h-5 w-5 " />
								{totalItems > 0 && (
									<Badge
										variant="secondary"
										className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
									>
										{totalItems}
									</Badge>
								)}
							</Link>
						</Button>
					)}
					{isAuthenticated
						? <UserProfile />
						: (
								<>
									<Button variant="accent" asChild>
										<Link href="/auth/login">Sign In</Link>
									</Button>
									<Button asChild>
										<Link href="/auth/register">Get Started</Link>
									</Button>
								</>
							)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
