export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface IIntervalService {
  calculateIntervals(): Promise<{
    min: ProducerInterval[];
    max: ProducerInterval[];
  }>;
}
