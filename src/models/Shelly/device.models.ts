export interface WifiSta {
  connected: boolean;
  ssid: string;
  ip: string;
  rssi: number;
}

export interface FwInfo {
  device: string;
  fw: string;
}

export interface Getinfo {
  fw_info: FwInfo;
}

export interface Mqtt {
  connected: boolean;
}

export interface Relay {
  ison: boolean;
  has_timer: boolean;
  timer_started: number;
  timer_duration: number;
  timer_remaining: number;
  overpower: boolean;
  source: string;
}

export interface ActionsStats {
  skipped: number;
}

export interface Meter {
  power: number;
  overpower: number;
  is_valid: boolean;
  timestamp: number;
  counters: number[];
  total: number;
}

export interface Cloud {
  enabled: boolean;
  connected: boolean;
}

export interface Update {
  status: string;
  has_update: boolean;
  new_version: string;
  old_version: string;
  beta_version: string;
}

export interface DevInfo {
  id: string;
  gen: string;
  code: string;
  online: boolean;
}

export interface Device {
  cfg_changed_cnt: number;
  wifi_sta: WifiSta;
  getinfo: Getinfo;
  has_update: boolean;
  _updated: string;
  ram_total: number;
  mqtt: Mqtt;
  time: string;
  relays: Relay[];
  actions_stats: ActionsStats;
  serial: number;
  uptime: number;
  meters: Meter[];
  cloud: Cloud;
  fs_size: number;
  mac: string;
  update: Update;
  ram_free: number;
  fs_free: number;
  unixtime: number;
  _dev_info: DevInfo;
}

export interface DevicesStatus {
  device: Device;
}

export interface PendingNotifications {}

export interface Data {
  devices_status: DevicesStatus;
  pending_notifications: PendingNotifications;
}

export interface ShellyDeviceRoot {
  isok: boolean;
  data: Data;
}
