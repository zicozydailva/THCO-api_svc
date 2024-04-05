export enum ITExperienceEnum {
  LessThan6Months = 'less_than_6_months',
  SixMonthsTo3Year = '6_months_to_3_years',
  ThreeYearsTo5Years = '3_years_to_5_years',
  GreaterThan5Years = 'greater_than_5_years',
}

export interface IUser {
  _id?: string;
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  about?: string;
  age?: number;
  country?: string | object;
  phoneNumber?: string;
  emailConfirm: boolean;
  hasChangedPassword?: boolean;
  createdAt?: Date;
  lastSeen?: Date;
  tenant?: string;
  subscriptionPlanId?: string[];
  programs?: string[];
}

export interface ICareerOnboardingInfo {
  ITExperience: ITExperienceEnum;
  onBoardingScore: number;
  isOnboarded: boolean;
  recommendedProgramId: string;
  cloudCertification: boolean;
  linuxExperience: number;
  isQualifiedForAdvanced: boolean;
  shouldTakeTest: boolean;
  skippedOnboarding: boolean;
  currentOnboardingSection: number;
}
