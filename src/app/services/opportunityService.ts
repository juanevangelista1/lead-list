import { Opportunity, Lead } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { ApiService } from './apiService';

class OpportunityService extends ApiService {
	private opportunities: Opportunity[] = [];

	async createOpportunityFromLead(lead: Lead): Promise<Opportunity> {
		console.log(`Creating opportunity from lead: ${lead.name}`);
		const newOpportunity: Opportunity = {
			id: uuidv4(),
			name: `${lead.name}`,
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
