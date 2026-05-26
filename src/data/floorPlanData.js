export const FLOORS = [
  { id: 'main-dining', name: 'Main Dining', labelMn: 'Үндсэн танхим', labelEn: 'Main dining' },
  { id: 'second-floor', name: 'Second Floor', labelMn: '2-р давхар', labelEn: 'Second floor' },
  { id: 'vip-area', name: 'VIP Area', labelMn: 'VIP хэсэг', labelEn: 'VIP area' },
];

export const FLOOR_TABLES = {
  'main-dining': [
    { id: 'T1', x: 92, y: 82, seats: 2, capacity: 2, type: 'standard', shape: 'rect' },
    { id: 'T2', x: 195, y: 82, seats: 4, capacity: 4, type: 'standard', shape: 'rect' },
    { id: 'T3', x: 298, y: 82, seats: 4, capacity: 4, type: 'standard', shape: 'rect' },
    { id: 'T4', x: 405, y: 82, seats: 6, capacity: 6, type: 'standard', shape: 'rect' },
    { id: 'T5', x: 92, y: 180, seats: 4, capacity: 4, type: 'standard', shape: 'rect' },
    { id: 'T6', x: 570, y: 135, seats: 8, capacity: 8, type: 'standard', shape: 'long' },
    { id: 'T7', x: 195, y: 180, seats: 4, capacity: 4, type: 'standard', shape: 'rect' },
    { id: 'T8', x: 298, y: 180, seats: 4, capacity: 4, type: 'standard', shape: 'rect' },
    { id: 'T9', x: 405, y: 180, seats: 6, capacity: 6, type: 'standard', shape: 'rect' },
    { id: 'T10', x: 500, y: 202, seats: 4, capacity: 4, type: 'standard', shape: 'rect' },
    { id: 'T11', x: 92, y: 285, seats: 6, capacity: 6, type: 'standard', shape: 'rect' },
    { id: 'T12', x: 195, y: 285, seats: 4, capacity: 4, type: 'standard', shape: 'round' },
    { id: 'T13', x: 298, y: 285, seats: 6, capacity: 6, type: 'standard', shape: 'rect' },
    { id: 'T14', x: 405, y: 285, seats: 4, capacity: 4, type: 'standard', shape: 'round' },
    { id: 'T15', x: 488, y: 292, seats: 4, capacity: 4, type: 'standard', shape: 'round' },
    { id: 'T16', x: 590, y: 292, seats: 6, capacity: 6, type: 'standard', shape: 'rect' },
  ],
  'second-floor': [
    { id: 'S1', x: 90, y: 95, seats: 4, capacity: 4, type: 'standard', shape: 'round' },
    { id: 'S2', x: 210, y: 95, seats: 4, capacity: 4, type: 'standard', shape: 'round' },
    { id: 'S3', x: 330, y: 95, seats: 6, capacity: 6, type: 'standard', shape: 'rect' },
    { id: 'S4', x: 470, y: 95, seats: 6, capacity: 6, type: 'standard', shape: 'rect' },
    { id: 'S5', x: 100, y: 242, seats: 8, capacity: 8, type: 'standard', shape: 'long' },
    { id: 'S6', x: 310, y: 245, seats: 4, capacity: 4, type: 'standard', shape: 'round' },
    { id: 'S7', x: 505, y: 242, seats: 10, capacity: 10, type: 'standard', shape: 'long' },
  ],
  'vip-area': [
    { id: 'V1', x: 105, y: 128, seats: 8, capacity: 8, type: 'vip', shape: 'long' },
    { id: 'V2', x: 330, y: 128, seats: 10, capacity: 10, type: 'vip', shape: 'long' },
    { id: 'V3', x: 555, y: 128, seats: 8, capacity: 8, type: 'vip', shape: 'long' },
    { id: 'V4', x: 205, y: 265, seats: 6, capacity: 6, type: 'vip', shape: 'round' },
    { id: 'V5', x: 415, y: 265, seats: 6, capacity: 6, type: 'vip', shape: 'round' },
  ],
};

export const pickRecommendedTable = (tablesOrGuestCount, tableStatesOrFloorId, guestCountMaybe) => {
  const tables = Array.isArray(tablesOrGuestCount)
    ? tablesOrGuestCount
    : (FLOOR_TABLES[tableStatesOrFloorId] || []);
  const tableStates = Array.isArray(tablesOrGuestCount) ? (tableStatesOrFloorId || {}) : {};
  const guestCount = Array.isArray(tablesOrGuestCount) ? guestCountMaybe : tablesOrGuestCount;
  const guests = Number(guestCount) || 0;
  const availableTables = tables.filter(t => !tableStates[t.id] || tableStates[t.id] === 'available');
  const source = availableTables.length ? availableTables : tables;
  const suitableTables = source
    .filter(t => (t.seats || t.capacity || 0) >= guests)
    .sort((a, b) => {
      const seatsA = a.seats || a.capacity || 0;
      const seatsB = b.seats || b.capacity || 0;
      return seatsA - seatsB || a.id.localeCompare(b.id, undefined, { numeric: true });
    });
  return suitableTables[0]?.id || source[0]?.id || '';
};

export const floorPlanData = {
  sections: FLOORS.map(floor => ({
    id: floor.id,
    name: floor.name,
    tables: FLOOR_TABLES[floor.id] || [],
  })),
};

export default floorPlanData;
