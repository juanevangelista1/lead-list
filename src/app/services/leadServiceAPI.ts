'use client';

import { Lead, LeadStatus } from '@/lib/types';
import leadsData from '../../../public/data/leads.json';

const API_LATENCY = 500;

class LeadServiceAPI {
	private leads: Lead[];

	constructor() {
		this.leads = leadsData as Lead[];
	}

	private simulateApiCall<T>(data: T): Promise<T> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(data), API_LATENCY);
		});
	}

	// Removida a ordenação para que a lista de leads chegue como está no JSON
	async fetchLeads(): Promise<Lead[]> {
		console.log('Fetching leads...');
		return this.simulateApiCall([...this.leads]);
	}

	async updateLeadStatus(id: string, newStatus: LeadStatus): Promise<Lead> {
		console.log(`Updating lead ${id} status to ${newStatus}...`);
		const leadToUpdate = this.leads.find((lead) => lead.id === id);
		if (!leadToUpdate) {
			throw new Error('Lead not found.');
		}
		const updatedLead = { ...leadToUpdate, status: newStatus };
		this.leads = this.leads.map((lead) => (lead.id === id ? updatedLead : lead));
		return this.simulateApiCall(updatedLead);
	}

	async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
		console.log(`Updating lead ${id} with data: `, updates);
		const leadToUpdate = this.leads.find((lead) => lead.id === id);
		if (!leadToUpdate) {
			throw new Error('Lead not found.');
		}
		const updatedLead = { ...leadToUpdate, ...updates };
		this.leads = this.leads.map((lead) => (lead.id === id ? updatedLead : lead));
		return this.simulateApiCall(updatedLead);
	}
}

export const leadService = new LeadServiceAPI();
