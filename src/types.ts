export type Mode = "coffee" | "wine";

export interface User {
  name: string;
  email: string;
  provider: "email" | "google" | "demo";
}

export interface BrewParameters {
  water_grams?: number;
  temperature?: number;
  brew_time?: number;
}

export interface CoffeeEntry {
  id: string;
  coffee_name: string;
  roaster?: string;
  country?: string;
  region?: string;
  process?: string;
  brew_method: string;
  dose_grams?: number;
  yield_grams?: number;
  shot_type?: "single" | "double";
  grinder_setting?: string;
  grind_note?: string;
  extraction_time_seconds?: number;
  brew_parameters?: BrewParameters;
  body?: string;
  sweetness?: string;
  acidity?: string;
  overall_result?: string;
  flavor_notes: string[];
  personal_notes?: string;
  photo_url?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface WineEntry {
  id: string;
  wine_name: string;
  producer?: string;
  vintage?: number;
  country?: string;
  region?: string;
  wine_type?: string;
  grapes: string[];
  flavor_notes: string[];
  aroma_notes: string[];
  body?: string;
  acidity?: string;
  tannins?: string;
  sweetness?: string;
  finish?: string;
  personal_rating?: WineRating;
  location?: string;
  company?: string;
  food_pairing?: string;
  occasion?: string;
  personal_notes?: string;
  photo_url?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export type WineRating = "nao" | "gostei" | "bastante" | "adorei";

/* ---------------- constantes de domínio ---------------- */

export const COFFEE_METHODS = [
  "Espresso",
  "V60",
  "Aeropress",
  "French Press",
  "Moka",
  "Chemex",
  "Filtro",
  "Outro",
];

export const FILTER_METHODS = ["V60", "Aeropress", "Chemex", "Filtro", "French Press"];

export const COFFEE_PROCESSES = ["Natural", "Lavado", "Honey", "Fermentado", "Outro", "Não sei"];

export const COFFEE_COUNTRIES = ["Brasil", "Colômbia", "Etiópia", "Quênia", "Guatemala", "Costa Rica", "Honduras", "Peru", "Indonésia", "Ruanda"];

export const GRIND_NOTES = ["Moagem mais fina", "Moagem média", "Moagem mais grossa"];

export interface ResultOption {
  value: string;
  emoji: string;
  label: string;
}

export const COFFEE_RESULTS: ResultOption[] = [
  { value: "muito-azedo", emoji: "😖", label: "Muito azedo" },
  { value: "pouco-azedo", emoji: "😕", label: "Um pouco azedo" },
  { value: "equilibrado", emoji: "🙂", label: "Equilibrado" },
  { value: "pouco-amargo", emoji: "😕", label: "Um pouco amargo" },
  { value: "muito-amargo", emoji: "😖", label: "Muito amargo" },
];

export const resultLabel = (v?: string) =>
  COFFEE_RESULTS.find((r) => r.value === v)?.label ?? v ?? "";

export interface NoteGroup {
  group: string;
  notes: string[];
}

export const COFFEE_NOTE_GROUPS: NoteGroup[] = [
  { group: "Doces", notes: ["Chocolate", "Caramelo", "Mel", "Açúcar mascavo", "Baunilha"] },
  {
    group: "Frutas",
    notes: ["Frutas vermelhas", "Cítrico", "Limão", "Laranja", "Maçã", "Pêssego", "Frutas tropicais"],
  },
  { group: "Outras", notes: ["Floral", "Nozes", "Castanhas", "Especiarias", "Terroso", "Chá"] },
];

export const WINE_NOTE_GROUPS: NoteGroup[] = [
  {
    group: "Frutas",
    notes: ["Cereja", "Morango", "Framboesa", "Amora", "Ameixa", "Cassis", "Maçã", "Pera", "Pêssego", "Limão", "Laranja", "Frutas tropicais"],
  },
  { group: "Doces", notes: ["Baunilha", "Caramelo", "Chocolate", "Mel"] },
  { group: "Especiarias", notes: ["Pimenta", "Canela", "Cravo"] },
  { group: "Madeira", notes: ["Carvalho", "Cedro", "Defumado"] },
  { group: "Outros", notes: ["Floral", "Terroso", "Couro", "Tabaco", "Café", "Ervas"] },
];

export const WINE_TYPES = ["Tinto", "Branco", "Rosé", "Espumante", "Sobremesa", "Fortificado"];

export const WINE_COUNTRIES = ["Argentina", "França", "Itália", "Portugal", "Espanha", "Austrália", "Chile", "Brasil", "Nova Zelândia", "Estados Unidos", "Alemanha", "Uruguai"];

export const GRAPE_LIST = [
  "Malbec",
  "Cabernet Sauvignon",
  "Shiraz",
  "Pinot Noir",
  "Merlot",
  "Tempranillo",
  "Sangiovese",
  "Tannat",
  "Chardonnay",
  "Sauvignon Blanc",
  "Riesling",
  "Moscatel",
];

export const WINE_LOCATIONS = ["Em casa", "Restaurante", "Viagem", "Casa de amigos", "Outro"];

export interface RatingOption {
  value: WineRating;
  label: string;
  hearts: number;
}

export const WINE_RATINGS: RatingOption[] = [
  { value: "nao", label: "Não foi para mim", hearts: 0 },
  { value: "gostei", label: "Gostei", hearts: 1 },
  { value: "bastante", label: "Gostei bastante", hearts: 2 },
  { value: "adorei", label: "Adorei", hearts: 3 },
];

export const ratingLabel = (v?: WineRating) =>
  WINE_RATINGS.find((r) => r.value === v)?.label ?? "";

export const SCALE_BODY = ["Leve", "Médio", "Encorpado"];
export const SCALE_LOW_HIGH = ["Baixa", "Média", "Alta"];
export const SCALE_TANNINS = ["Baixos", "Médios", "Altos"];
export const SCALE_SWEET_WINE = ["Seco", "Meio seco", "Doce"];
export const SCALE_FINISH = ["Curto", "Médio", "Longo"];
