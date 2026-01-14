export interface Difficulty {
  id: number;
  title: 'beginner' | 'intermediate' | 'advanced';
}

export const DIFFICULTIES: Difficulty[] = [
  { id: 0, title: "beginner" },
  { id: 1, title: "intermediate" },
  { id: 2, title: "advanced" },
];