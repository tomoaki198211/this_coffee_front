export interface Coffee {
  id: number;
  user_id: number;
  coffee_id: number;
  intuition: number;
  flavor: number;
  sweetness: number;
  rich: number;
  acidity: number;
  bitter: number;
  remarks: string;
  setting: boolean;
  created_at: Date;
  updated_at: Date;
}
