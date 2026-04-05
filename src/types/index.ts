// ============================================
// GitHub API Types
// ============================================

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface LanguageStat {
  language: string;
  bytes: number;
  percentage: number;
  color: string;
}

// ============================================
// Portfolio Data (GraphQL build-time)
// ============================================

export interface PortfolioKPIs {
  publicRepos: number;
  followers: number;
  mergedPRs: number;
  totalCommits: number;
  totalPRContributions: number;
  totalIssueContributions: number;
  totalContributions: number;
  yearsActive: number;
}

export interface ContributedRepo {
  name: string;
  owner: string;
  url: string;
}

export interface GitHubPortfolioData {
  profile: GitHubUser;
  kpis: PortfolioKPIs;
  pinnedRepos: GitHubRepo[];
  repos: GitHubRepo[];
  languages: LanguageStat[];
  contributedTo: ContributedRepo[];
  fetchedAt: string;
}

// ============================================
// LinkedIn / Experience Data Types
// ============================================

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
  type: 'work' | 'freelance' | 'project';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

// ============================================
// Navigation
// ============================================

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
