
export interface Client {
  id: string;
  name: string;
  email: string;
  baseId: string;
  password: string;
}

export interface AirtableRecord<T> {
  id: string;
  createdTime: string;
  fields: T;
}

export interface Lead {
  'Lead ID'?: number;
  'Full Name'?: string;
  'Email'?: string;
  'Phone'?: string;
  'Car Interest'?: string;
  'Source'?: 'Website' | 'WhatsApp' | 'Instagram' | 'Facebook';
  'Created Date'?: string;
  'Notes'?: string;
}

export interface Appointment {
  'Booking ID'?: number;
  'Full Name'?: string;
  'Email'?: string;
  'Phone'?: string;
  'Vehicle'?: string;
  'Date & Time'?: string;
  'Channel'?: 'Website' | 'WhatsApp' | 'Instagram' | 'Facebook';
  'Created'?: string;
}

export interface FinanceCalculation {
    'Car price'?: number;
    'Down Payment'?: number;
    'Trade in value'?: number;
    'Interest Rate'?: number;
    'Term Months'?: number;
    'Monthly Payments'?: number;
    'Total Cost'?: number;
    'Total Interest'?: number;
}
