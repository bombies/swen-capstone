'use client';

import type { Address } from '@/api-utils/types/order.types';

interface ShippingDetailsProps {
	address: Address;
}

export default function ShippingDetails({ address }: ShippingDetailsProps) {
	return (
		<div className="space-y-2">
			<p className="text-sm text-gray-900">{address.street}</p>
			<p className="text-sm text-gray-900">
				{address.city}
				,
				{' '}
				{address.state}
				{' '}
				{address.zipCode}
			</p>
			<p className="text-sm text-gray-900">{address.country}</p>
		</div>
	);
}
