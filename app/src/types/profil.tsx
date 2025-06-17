type Badge = {
  id: number;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
};
interface StatItem {
  id: number;
  name: CategoryName;
  icon: string;
  color: string;
}

type CategoryName = 'Fiziksel' | 'Sosyal' | 'Zihinsel' | 'Disiplin';

interface TaskData {
  category?: string;
  completed?: boolean;
}
