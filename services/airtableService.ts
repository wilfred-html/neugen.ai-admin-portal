import { AirtableRecord, Lead, Appointment, FinanceCalculation } from '../types';

// In a real-world scenario, this would come from a secure environment variable.
const AIRTABLE_API_KEY = "patiMhAzUYxKEO16M.61e11832f5dc1ca411e777ae0bfa6b3b18ae0146908bd00707f5e6f6e1b812a5";
const AIRTABLE_API_URL = "https://api.airtable.com/v0";

const getHeaders = () => ({
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
});

const fetchData = async <T,>(baseId: string, tableName: string): Promise<AirtableRecord<T>[]> => {
  try {
    const response = await fetch(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`, { headers: getHeaders() });
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Airtable API error for table ${tableName}:`, errorData);
      throw new Error(`Failed to fetch from ${tableName}`);
    }
    const data = await response.json();
    return (data.records || []) as AirtableRecord<T>[];
  } catch (error) {
    console.error(`Error fetching data for table ${tableName}:`, error);
    return [];
  }
};

export const createRecord = async <T,>(baseId: string, tableName: string, fields: T): Promise<AirtableRecord<T>> => {
    const response = await fetch(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ fields }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error(`Airtable API error for creating record in ${tableName}:`, errorData);
        throw new Error(`Failed to create record in ${tableName}`);
    }
    return response.json();
};

export const updateRecord = async <T,>(baseId: string, tableName: string, recordId: string, fields: Partial<T>): Promise<AirtableRecord<T>> => {
    const response = await fetch(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}/${recordId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ fields }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error(`Airtable API error for updating record ${recordId} in ${tableName}:`, errorData);
        throw new Error(`Failed to update record in ${tableName}`);
    }
    return response.json();
};


export const deleteRecord = async (baseId: string, tableName: string, recordId: string): Promise<{ deleted: boolean, id: string }> => {
    const response = await fetch(`${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}/${recordId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error(`Airtable API error for deleting record ${recordId} in ${tableName}:`, errorData);
        throw new Error(`Failed to delete record in ${tableName}`);
    }
    return response.json();
};


export const getClientData = async (baseId: string) => {
  try {
    const [leads, appointments, financeCalculations] = await Promise.all([
      fetchData<Lead>(baseId, 'Leads'),
      fetchData<Appointment>(baseId, 'Appointments'),
      fetchData<FinanceCalculation>(baseId, 'Finance Calculator'),
    ]);
    return { leads, appointments, financeCalculations };
  } catch (error) {
    console.error("Failed to load all client data:", error);
    return { leads: [], appointments: [], financeCalculations: [] };
  }
};