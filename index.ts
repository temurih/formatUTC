const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface MyDate {
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

export class FormatUTC {
  today: MyDate;
  calendarDate: MyDate;

  constructor(dateString?: string) {
    const today = this.parseDate(new Date().toISOString());
    this.today = { ...today };
    if (!dateString) {
      this.calendarDate = { ...today };
      return;
    }
    try {
      this.calendarDate = this.parseDate(dateString);
    } catch (e) {
      this.calendarDate = { ...today };
    }
  }

  private parseDate(originalDate: string): MyDate {
    const split = originalDate.split('T');
    const preSplitDate = split[0];
    const time = split[1];
    const dateSplit = preSplitDate.split('-');
    const date = parseInt(dateSplit[2]);
    const month = parseInt(dateSplit[1]) - 1; // JS months are zero-based index
    const year = parseInt(dateSplit[0]);
    let hour: number | undefined = undefined;
    let minute: number | undefined = undefined;
    let seconds: number | undefined = undefined;
    if (time) {
      const timeSplit = time.split(':');
      hour = parseInt(timeSplit[0]);
      minute = parseInt(timeSplit[1]);
      seconds = parseInt(timeSplit[1].split('.')[0]);
    }
    const week = this.getNumberOfWeeksInMonth(year, month, date);
    return {
      originalDate,
      totalWeeksInTheMonth: week.totalWeeks,
      currentDateWeekNumber: week.currentDateWeek,
      date,
      month,
      year,
      hour,
      minute,
      seconds,
    };
  }

  private getNumberOfWeeksInMonth(year: number, month: number, date: number) {
    const firstDate = new Date(year, month, 1);
    const adjustedDate = date + firstDate.getDay();
    const prefixes = ['0', '1', '2', '3', '4', '5'];

    const firstWeekday = firstDate.getDay();
    const offsetDate = date + firstWeekday - 1;
    return {
      currentDateWeek: Math.floor(offsetDate / 7),
      totalWeeks: parseInt(prefixes[0 | (adjustedDate / 7)]) + 1,
    };
  }

  public formatTime(): string | undefined {
    let hour: number | undefined = this.calendarDate.hour;
    let minute: number | string | undefined = this.calendarDate.minute;
    if (hour === undefined || minute === undefined) return undefined;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour || 12; // the hour '0' should be '12'
    minute = minute < 10 ? '0' + minute : minute;
    const strTime = hour + ':' + minute + ' ' + amPm;
    return strTime;
  }

  public formatDateOnly() {
    return `${this.calendarDate.date} ${months[this.calendarDate.month]} ${
      this.calendarDate.year
    }`;
  }

  public formatDate(): string {
    const time = this.formatTime();
    const date = this.formatDateOnly();
    if (!time) return date;
    return `${date} ${time}`;
  }

  public thisWeek(): boolean {
    return (
      this.thisMonth() &&
      this.calendarDate.currentDateWeekNumber ===
        this.today.currentDateWeekNumber
    );
  }

  public thisMonth(): boolean {
    return (
      this.calendarDate.year === this.today.year &&
      this.calendarDate.month === this.today.month
    );
  }

  public compareDateWithToday(): -1 | 0 | 1 {
    const today = this.today;
    const currentDate = this.calendarDate;

    if (currentDate.year < today.year) return -1;
    if (currentDate.year > today.year) return 1;

    if (currentDate.month < today.month) return -1;
    if (currentDate.month > today.month) return 1;

    if (currentDate.date < today.date) return -1;
    if (currentDate.date > today.date) return 1;

    return 0;
  }

  public getDateObject() {
    return {
      today: this.today,
      calendarDate: this.calendarDate,
    };
  }
}
