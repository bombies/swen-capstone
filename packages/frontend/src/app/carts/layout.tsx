import type { FC, PropsWithChildren } from 'react';

const CartsLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<main className="p-12">
			{children}
		</main>
	);
};

export default CartsLayout;
