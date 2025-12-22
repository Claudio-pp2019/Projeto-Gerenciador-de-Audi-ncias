export type ItemType = 'hearing' | 'reminder';

export interface Attachment {
  name: string;
  type: string;
  data: string;
}

export interface BaseItem {
  id: string;
  author: string; 
  status: 'pending' | 'completed'; 
  clientName: string;
  clientWhatsapp: string;
  assistantWhatsapp?: string;
  clientEmail: string;
  date: string; 
  time: string; 
  deadline: string; 
  description: string;
  type: ItemType;
  caseNumber?: string; // Novo
  jurisdiction?: string; // Novo
}

export interface Hearing extends BaseItem {
  type: 'hearing';
  court: string; 
}

export interface Reminder extends BaseItem {
  type: 'reminder';
  title: string;
}

export type LegalItem = Hearing | Reminder;