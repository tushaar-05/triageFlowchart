import Dexie, { type Table } from 'dexie';

export interface PatientRecord {
  id?: number; // Auto-incremented local ID
  server_id?: number | null; // ID from TiDB backend once synced
  staff_id: string; // The nurse who created it
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  chief_complaint: string;
  created_at: string;
  synced: boolean; // Sync status flag
}

export interface CaseRecord {
  id?: number;
  server_id?: number | null;
  patient_local_id: number;
  staff_id: string;
  protocol_id: number | null;
  risk_level: string;
  notes: string;
  started_at: string;
  completed_at: string | null;
  synced: boolean;
}

export class TriageDatabase extends Dexie {
  patients!: Table<PatientRecord, number>;
  cases!: Table<CaseRecord, number>;

  constructor() {
    super('TriageFlowDB');

    // Define IndexedDB tables
    // The format is: Primary key, then any fields you want to index/search by
    this.version(1).stores({
      patients: '++id, server_id, synced, created_at',
      cases: '++id, server_id, patient_local_id, synced'
    });
  }
}

export const db = new TriageDatabase();
