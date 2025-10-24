import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function parseStoredValue<T>(key: string, initialValue: T): T {
	if (typeof window === 'undefined') {
		return initialValue;
	}
	try {
		const item = window.localStorage.getItem(key);
		return item ? JSON.parse(item) : initialValue;
	} catch (error) {
		console.error(`[useLocalStorage] Error reading key “${key}”:`, error);
		return initialValue;
	}
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
	const [storedValue, setStoredValue] = useState<T>(() => parseStoredValue(key, initialValue));

	const setValue: Dispatch<SetStateAction<T>> = (value) => {
		if (typeof window === 'undefined') {
			console.warn(`[useLocalStorage] Tried to set key “${key}” on server side.`);
			return;
		}
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(`[useLocalStorage] Error setting key “${key}”:`, error);
		}
	};

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue) {
				try {
					setStoredValue(JSON.parse(e.newValue));
				} catch (error) {
					console.error(`[useLocalStorage] Error parsing storage change:`, error);
				}
			}
		};
		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, [key]);

	return [storedValue, setValue];
}
