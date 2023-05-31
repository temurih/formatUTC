export interface MyDate {
  originalDate: string;
  date: number;
  month: number; // JS months are zero-based index
  currentDateWeekNumber: number;
  totalWeeksInTheMonth: number;
  year: number;
  hour: number | undefined;
  minute: number | undefined;
  seconds: number | undefined;
}

declare class FormatUTC {
  constructor(date?: string);
  formatTime: () => string | undefined;
  formatDateOnly: () => void;
  formatDate: () => string;
  thisWeek: () => boolean;
  thisMonth: () => boolean;
  compareDateWithToday: () => -1 | 0 | 1;
  getDateObject: () => void;
}
