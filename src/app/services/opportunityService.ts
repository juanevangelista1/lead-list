import { Opportunity, Lead } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const API_LATENCY = 500;

class OpportunityService {
	private opportunities: Opportunity[] = [];

	private simulateApiCall<T>(data: T): Promise<T> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(data), API_LATENCY);
		});
	}

	async createOpportunityFromLead(lead: Lead): Promise<Opportunity> {
		console.log(`Creating opportunity from lead: ${lead.name}`);
		const newOpportunity: Opportunity = {
			id: uuidv4(),
			name: `Opportunity for ${lead.name}`,
			stage: 'Discovery',
			amount: null,
			accountName: lead.company,
		};
		this.opportunities.push(newOpportunity);
		return this.simulateApiCall(newOpportunity);
	}

	async fetchOpportunities(): Promise<Opportunity[]> {
		console.log('Fetching opportunities...');
		return this.simulateApiCall(this.opportunities);
	}
}

export const opportunityService = new OpportunityService();
