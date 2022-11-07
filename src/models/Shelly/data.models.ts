export interface History {
  datetime: string;
  consumption: number;
  available: boolean;
}

export interface Units {
  consumption: string;
}

export interface Data {
  history: History[];
  timezone: string;
  history_interval: string;
  total: number;
  units: Units;
}

export interface ShellyDataRoot {
  isok: boolean;
  data: Data;
}
