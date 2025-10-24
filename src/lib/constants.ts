import { Tab } from '@/app/page';
import { LeadStatus } from '@/lib/types';

export const TABS: Tab[] = ['Leads', 'Opportunities'];

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
	LeadStatus.New,
	LeadStatus.Contacted,
	LeadStatus.Qualified,
	LeadStatus.Archived,
];

export const APP_NAME = 'Mini Seller Console';
export const APP_DESCRIPTION =
	'A lightweight console to triage leads and convert them into opportunities.';

export const APP_BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://mini-seller-console.vercel.app'
		: 'http://localhost:3000';
