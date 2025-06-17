'use client';

import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import type { ImageProps } from 'next/image';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { useState } from 'react';

import { cn } from '../../lib/utils';

export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

type Props = Omit<ImageProps, 'objectFit' | 'src'> & {
	globalClassName?: string;
	imageClassName?: string;
	fadeIn?: boolean;
	objectFit?: ObjectFit;
	fallbackSrc?: string;
	src?: string | StaticImport | null;
};

const Image: FC<Props> = ({
	fadeIn,
	className,
	globalClassName,
	imageClassName,
	objectFit,
	fallbackSrc = '/fallback/image.png',
	src,
	...props
}) => {
	const [currentSrc, setCurrentSrc] = useState<typeof src>(src);

	return (
		<motion.div
			initial={fadeIn ? { opacity: 0, y: -50 } : undefined}
			whileInView={fadeIn ? { opacity: 1, y: 0 } : undefined}
			transition={fadeIn ? { duration: 0.5 } : undefined}
			viewport={fadeIn ? { once: true } : undefined}
			className={cn('!relative overflow-hidden', className, globalClassName)}
		>
			<NextImage
				{...props}
				src={currentSrc || fallbackSrc}
				onError={() => {
					if (fallbackSrc) setCurrentSrc(fallbackSrc);
				}}
				className={cn(globalClassName, imageClassName)}
				style={{ objectFit, ...props.style }}
				sizes={props.fill ? '100%' : undefined}
				draggable={false}
			/>
		</motion.div>
	);
};

export default Image;
