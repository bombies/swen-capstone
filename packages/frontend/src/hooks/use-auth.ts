'use client';

import { useAuth as useAuthContext } from '@/contexts/auth-context';

// Re-export the context hook for backward compatibility
export function useAuth() {
	return useAuthContext();
}
