interface EPJsonPackageType {
  key: string;
  rental_type: number;
  code: string;
  price: number;
  was_price: number;
  park_code: string;
  arrival_date: string;
  no_nights: number;
  tactical_code: string;
  units_available: number;
  time_modified: string;
}


interface GradeConfigValues {
  starting_date: string;
  total_available_dates: number;
  price_per_night: number;
  was_price_per_night: number
  total_available_units: number;
}

interface GenerateConfigType {
  park_code: string;
  gold?: GradeConfigValues;
  silver?: GradeConfigValues;
  bronze?: GradeConfigValues;
}