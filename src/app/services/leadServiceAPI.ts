'use client';

import { Lead } from '@/lib/types';
import leadsData from '../../../public/data/leads.json';
import { ApiService } from './apiService';

class LeadServiceAPI extends ApiService {
	private leads: Lead[];

	constructor() {
		super();
		this.leads = leadsData as Lead[];
	}

	async fetchLeads(): Promise<Lead[]> {
		console.info('[LeadService] Fetching leads...');
		return this.simulateApiCall([...this.leads]);
	}

	async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
		console.info(`[LeadService] Updating lead ${id} with data: `, updates);
		const leadToUpdate = this.findItemById(this.leads, id, 'Lead');
		const updatedLead = { ...leadToUpdate, ...updates };
		this.leads = this.leads.map((lead) => (lead.id === id ? updatedLead : lead));
		return this.simulateApiCall(updatedLead);
	}
}

export const leadService = new LeadServiceAPI();
