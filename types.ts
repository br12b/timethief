export enum MascotMood {
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  SLEEPY = 'SLEEPY',
  ANGRY = 'ANGRY',
  DISAPPOINTED = 'DISAPPOINTED',
}

export interface ChronosResponse {
  roast: string;
  opportunityCost: string;
  mood: MascotMood;
  quickRecovery: string;
}

export interface UserInput {
  appCategory: string;
  timeSpent: number;
  userGoals: string;
}
