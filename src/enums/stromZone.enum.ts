const stromZoneArray = ['NO1', 'NO2', 'NO3', 'NO4', 'NO5'] as const;
export type StromZoneEnum = typeof stromZoneArray[number];
