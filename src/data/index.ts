import dayjs from 'dayjs';

const generatePriceDates = ({
  price_per_night,
  starting_date,
  total_available_dates,
  total_available_units,
  was_price_per_night
}) => {
  const availableDates = [];
  const addFormattedDate = (dt, duration) => {
    availableDates.push({
      date: dt.format('YYYY-MM-DD'),
      duration,
      price: price_per_night * duration,
      was_price: was_price_per_night * duration,
      units_available: total_available_units,
    });
  }
  [3, 4, 7].forEach((duration) => {
    let currDate = dayjs(starting_date);
    addFormattedDate(currDate, duration);
    for (let i = 0; i < total_available_dates; i += 1) {
      currDate = currDate.add(duration, 'days');
      addFormattedDate(currDate, duration);
    }
  })
  return availableDates;
}

const generateRowsPerGrade = (park_code, gradeCode, grade: GradeConfigValues): EPJsonPackageType[] => {
  if (!grade) return [];
  const availablePriceDates = generatePriceDates(grade);
	return availablePriceDates.map<EPJsonPackageType>((pd) => {
    const code = `${park_code}${gradeCode}CV26`;
    const time_modified = new Date().toISOString();
    return {
      key: `${park_code}_${code}_${pd.date}_${pd.duration}`,
      rental_type: 1,
      code,
      description: '',
      price: pd.price,
      was_price: pd.was_price,
      park_code,
      arrival_date: new Date(pd.date).toISOString(),
      no_nights: pd.duration,
      units_available: pd.units_available,
      tactical_code: '',
      time_modified,
    }
  });
};

export const generateParkAvailability = ({
  park_code,
  gold,
  silver,
  bronze,
}: GenerateConfigType): EPJsonPackageType[] => {
  return [
    ...generateRowsPerGrade(park_code, 'GP', gold),
    ...generateRowsPerGrade(park_code, 'SV', silver),
    ...generateRowsPerGrade(park_code, 'BR', bronze),
  ];
}