export interface Dashboard {
  new_cnt: number;
  in_progress_cnt: number;
  completed_cnt: number;
  total_cnt: number;
  day_statistic: DayStatistic[];
  category_statistic: CategoryStatistic[];
}

export interface DayStatistic {
  day: string;
  cnt: number;
}

export interface CategoryStatistic {
  category_name: string;
  procent: number;
}
