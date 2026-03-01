import Dexie, { type EntityTable } from 'dexie';

interface PatientOffline {
  id?: number;
  staff_id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  chief_complaint: string;
  created_at: string;
  synced: boolean;
}

const db = new Dexie('TriageFlowDB') as Dexie & {
  patients: EntityTable<
    PatientOffline,
    'id'
  >;
};

db.version(1).stores({
  patients: '++id, staff_id, created_at, synced'
});

export { db };
