export interface Device {
  id: string;
  name: string;
  image: string;
  category: string;
  type: string;
  room_id: number;
  channel: number;
  channels_count: number;
  exclude_event_log: boolean;
  name_sync: boolean;
  gen: number;
  mode: string;
  cloud: boolean;
  cloud_assoc: boolean;
  template: string;
  position: number;
  modified: number;
  externals: boolean;
  consumption_type: number;
}

export interface Devices {
  device: Device;
}

export interface Room {
  name: string;
  image: string;
  position: number;
  main_sensor: boolean;
  overview_style: boolean;
  floor: number;
  room_id: string;
  id: number;
  modified: number;
}

export interface Rooms {
  room: Room;
}

export interface Groups {}

export interface Dashboards {}

export interface Data {
  devices: Devices;
  rooms: Rooms;
  groups: Groups;
  dashboards: Dashboards;
}

export interface ShellyDeviceRoot {
  isok: boolean;
  data: Data;
}

export interface ShellyDevice {
  value: string;
  label: string;
}
