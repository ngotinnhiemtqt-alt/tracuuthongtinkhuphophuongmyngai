export interface Neighborhood {
  id: string;
  newName: string;
  oldNames: string[];
  area: number;
  households: number;
  population: number;
  leader: string;
  phone: string;
  address: string;
  mapX?: number;
  mapY?: number;
}

export interface Headquarter {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
  logoUrl?: string; // We'll store base64 string here for simplicity in a small app
}

export interface AppData {
  neighborhoods: Neighborhood[];
  headquarters: Headquarter[];
}
