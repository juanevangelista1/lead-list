export class BaseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class NotFoundError extends BaseError {
	constructor(entity: string = 'Resource') {
		super(`${entity} not found.`);
	}
}
