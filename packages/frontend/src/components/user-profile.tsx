'use client';

import type { FC } from 'react';
import type { UserRole } from '@/api-utils/types/auth.types';
import { LogOut, Receipt, ShoppingBag, Store, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLogout, useSwitchRole } from '@/api-utils/hooks/auth.hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

const UserProfile: FC = () => {
	const { session, tokenId, user: { data: userData } } = useAuth();
	const { mutate: logout, isPending: isLoggingOut } = useLogout();
	const router = useRouter();
	const { mutate: switchRole, isPending: isSwitchingRole } = useSwitchRole();

	if (!session || !userData) return null;

	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName[0]}${lastName[0]}`.toUpperCase();
	};

	const handleRoleSwitch = (role: UserRole) => {
		if (!tokenId)
			return;

		if (role === 'merchant' && !userData.roles.includes('merchant'))
			return router.push('/become-merchant');

		switchRole({ role, tokenId });
	};

	const handleLogout = () => {
		if (tokenId) {
			logout({ tokenId });
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage src={userData.profilePicture} alt={userData.firstName} />
						<AvatarFallback>
							{getInitials(userData.firstName, userData.lastName)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{userData.firstName}
							{' '}
							{userData.lastName}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{userData.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					{userData.activeRole === 'customer' && (
						<>
							<DropdownMenuItem
								disabled={isSwitchingRole}
								asChild
							>
								<Link href="/orders">
									<Receipt className="mr-2 h-4 w-4" />
									<span>Orders</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleRoleSwitch('merchant')}
								disabled={isSwitchingRole}
							>
								<Store className="mr-2 h-4 w-4" />
								<span>Switch to Seller</span>
							</DropdownMenuItem>
						</>

					)}
					{userData.activeRole === 'merchant' && (
						<>
							<DropdownMenuItem
								disabled={isSwitchingRole}
								asChild
							>
								<Link href="/merchant">
									<User className="mr-2 h-4 w-4" />
									<span>Merchant Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleRoleSwitch('customer')}
								disabled={isSwitchingRole}
							>
								<ShoppingBag className="mr-2 h-4 w-4" />
								<span>Switch to Buyer</span>
							</DropdownMenuItem>
						</>

					)}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-red-600 focus:text-red-600"
					onClick={handleLogout}
					disabled={isLoggingOut}
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserProfile;
