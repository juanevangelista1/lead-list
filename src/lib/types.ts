export enum LeadStatus {
	New = 'New',
	Contacted = 'Contacted',
	Qualified = 'Qualified',
	Opportunity = 'Opportunity',
	Archived = 'Archived',
}

export enum OpportunityStage {
	Discovery = 'Discovery',
	Proposal = 'Proposal',
	Negotiation = 'Negotiation',
	ClosedWon = 'Closed Won',
	ClosedLost = 'Closed Lost',
}

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
