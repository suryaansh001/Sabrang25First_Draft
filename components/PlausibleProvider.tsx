'use client';

import React, { createContext, useCallback, useContext } from 'react';

// Minimal event signature compatible with Plausible usage in the app
interface PlausibleEventOptions {
	props?: Record<string, string | number | boolean>;
}

type PlausibleFn = (eventName: string, options?: PlausibleEventOptions) => void;

const PlausibleContext = createContext<PlausibleFn>(() => {});

interface LocalPlausibleProviderProps {
	domain?: string;
	children: React.ReactNode;
}

export default function PlausibleProvider({ children }: LocalPlausibleProviderProps) {
	// No-op plausible function that safely accepts calls
	const plausible = useCallback<PlausibleFn>(() => {
		// Intentionally empty: analytics disabled/no-op
	}, []);

	return (
		<PlausibleContext.Provider value={plausible}>
			{children}
		</PlausibleContext.Provider>
	);
}

export function usePlausible(): PlausibleFn {
	return useContext(PlausibleContext);
}
