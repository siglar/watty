export interface FylkeLookupResult {
  fylkesnummer: string;
  fylkesnavn: string;
}

export interface GridCompanyLookupResult {
  organisasjonsnummer: string;
  navn: string;
}

export interface UserSettings {
  fylkeNr?: string;
  fylkeNavn?: string;
  organisasjonsNr?: string;
  organisasjonsNavn?: string;
}
