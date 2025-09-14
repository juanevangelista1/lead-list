import { NotFoundError } from '@/lib/errors';

const API_LATENCY = 500;

export abstract class ApiService {
	protected simulateApiCall<T>(data: T): Promise<T> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(data), API_LATENCY);
		});
	}

	protected findItemById<T extends { id: string }>(items: T[], id: string, entityName: string): T {
		const item = items.find((i) => i.id === id);
		if (!item) {
			throw new NotFoundError(entityName);
		}
		return item;
	}
}
