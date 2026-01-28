
export enum Category {
  SPORT = 'Deportes',
  CULTURE = 'Cultura',
  FOOD = 'Gastronomía',
  TECH = 'Tecnología',
  OTHER = 'Otros'
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: Category;
  maxParticipants: number;
  participants: string[]; // List of user IDs
  creatorId: string;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}
