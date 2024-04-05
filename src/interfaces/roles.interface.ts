export enum RoleNameEnum {
  SuperAdmin = 'SUPER_ADMIN',
  Admin = 'ADMIN',
  Support = 'SUPPORT',
  Mentor = 'MENTOR',
  Moderator = 'MODERATOR',
  Recruiter = 'RECRUITER',
  CorpAdmin = 'CORPORATE_ADMIN',
  CorpStudent = 'CORPORATE_STUDENT',
  Instructor = 'INSTRUCTOR',
  Student = 'STUDENT',
  Editor = 'EDITOR',
  ScholarshipStudent = 'SCHOLARSHIP_STUDENT',
  YellowBadgedMentor = 'YELLOW_BADGED_MENTOR',
  BlueBadgedMentor = 'BLUE_BADGED_MENTOR',
  GreenBadgedMentor = 'GREEN_BADGED_MENTOR',
}

export enum ActionEnum {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Subject {
  StepManagement = 'STEP_MANAGEMENT',
  CohortManagement = 'COHORT_MANAGEMENT',
  ProjectReview = 'PROJECT_REVEW',
  Knowledge_Gap = 'KNOWLEDGE_GAP',
  UserManagement = 'USER_MANAGEMENT',
  BusinessManagement = 'BUSINESS_MANAGEMENT',
  SessionManagement = 'SESSION_MANAGEMENT',
  SessionCreditManagement = 'SESSION_CREDIT_MANAGEMENT',
}

export interface IAction {
  action: ActionEnum;
  subject: Subject;
  description: string;
}

export interface IRole {
  name: RoleNameEnum;
  description: string;
  actions: IAction[];
}

export enum UserLoginStrategy {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}
