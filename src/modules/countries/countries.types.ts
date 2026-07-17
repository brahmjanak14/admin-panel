export interface CountryContent {
  slug: string;
  name: string;
  flag: string;
  heroTitle: string;
  heroSubtitle: string;
  overview: string;
  benefits: FeatureItem[];
  universities: University[];
  popularCourses: Course[];
  eligibility: string[];
  requirements: string[];
  documents: string[];
  visaProcess: ProcessStep[];
  timeline: ProcessStep[];
  cost: { label: string; value: string }[];
  scholarships: Scholarship[];
  livingExpenses: { label: string; value: string }[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  seo: { title: string; description: string };
}

export interface ServiceContent {
  slug: string;
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  overview: string;
  whoIsItFor: string[];
  benefits: FeatureItem[];
  process: ProcessStep[];
  documents: string[];
  timeline: string;
  faqs: FaqItem[];
  seo: { title: string; description: string };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  body?: string;
  status?: 'draft' | 'published';
  seo: { title: string; description: string };
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  duration?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  quote: string;
  rating: number;
  avatar?: string;
  university?: string;
}

interface University {
  id: string;
  name: string;
  country: string;
  ranking: number;
  logo?: string;
  location: string;
  programs: string[];
}

interface Course {
  id: string;
  title: string;
  level: string;
  duration: string;
  field: string;
  countries: string[];
}

interface Scholarship {
  id: string;
  title: string;
  amount: string;
  country: string;
  deadline: string;
  eligibility: string;
}

export type CountryContentBody = Omit<CountryContent, 'slug' | 'name' | 'flag'>;
export type ServiceContentBody = Omit<ServiceContent, 'slug' | 'name'>;
