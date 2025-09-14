export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Opportunity' | 'Archived';
export type OpportunityStage =
	| 'Discovery'
	| 'Proposal'
	| 'Negotiation'
	| 'Closed Won'
	| 'Closed Lost';

export interface Lead {
	id: string;
	name: string;
	company: string;
	email: string;
	source: string;
	score: number;
	status: LeadStatus;
}

export interface Opportunity {
	id: string;
	name: string;
	stage: OpportunityStage;
	amount: number | null;
	accountName: string;
}
