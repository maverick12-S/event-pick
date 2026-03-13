export type PostSearchFilters = {
  title: string;
  categories: string[];
  prefectures: string[];
  cities: string[];
  timeSlots: string[];
};

export const defaultPostSearchFilters: PostSearchFilters = {
  title: '',
  categories: [],
  prefectures: [],
  cities: [],
  timeSlots: [],
};

export const toSelectedValues = (selected: unknown): string[] => {
  if (Array.isArray(selected)) {
    return selected.map((value) => String(value));
  }

  if (typeof selected === 'string' && selected.length > 0) {
    return selected.split(',').map((value) => value.trim()).filter(Boolean);
  }

  return [];
};

export const detectTimeSlot = (timeLabel: string): string => {
  const startHour = Number.parseInt(timeLabel.slice(0, 2), 10);
  if (Number.isNaN(startHour)) return '';
  if (startHour < 12) return '朝';
  if (startHour < 16) return '昼';
  if (startHour < 19) return '夕方';
  return '夜';
};
