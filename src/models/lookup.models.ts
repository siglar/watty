export interface FylkeLookupResult {
  fylkesnummer: string;
  fylkesnavn: string;
}

export interface GridCompanyLookupResult {
  organisasjonsnummer: string;
  navn: string;
}

export interface PowerTierLookupResult {
  value: number;
  label: string;
}

export interface UserSettings {
  fylkeNr?: string;
  fylkeNavn?: string;
  organisasjonsNr?: string;
  organisasjonsNavn?: string;
  powerTier?: number;
}
