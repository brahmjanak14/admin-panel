import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/shared/utils/password';

const prisma = new PrismaClient();

const defaultBenefits = [
  { id: '1', title: 'Globally Recognized Degrees', description: 'Qualifications respected worldwide.', icon: 'Award' },
  { id: '2', title: 'Post-Study Work', description: 'Clear pathways to international work experience.', icon: 'Briefcase' },
];

const defaultProcess = [
  { id: '1', title: 'Consultation', description: 'Understand goals and eligibility.', duration: '1 day' },
  { id: '2', title: 'Documentation', description: 'Collect and validate required documents.', duration: '1-2 weeks' },
  { id: '3', title: 'Application', description: 'Submit complete application package.', duration: '2-4 weeks' },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@shyaam.in';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';
  const adminName = process.env.SEED_ADMIN_NAME ?? 'Super Admin';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: 'super_admin',
    },
  });

  const countries = [
    {
      slug: 'canada',
      name: 'Canada',
      flag: '🇨🇦',
      content: {
        heroTitle: 'Study in Canada',
        heroSubtitle: 'World-class education with post-graduation work opportunities.',
        overview: 'Canada offers internationally recognized degrees, diverse campuses, and clear post-study work pathways for international students seeking quality education abroad.',
        benefits: defaultBenefits,
        universities: [],
        popularCourses: [],
        eligibility: ['Minimum 60% in previous qualification', 'Valid English proficiency test'],
        requirements: ['Offer letter from DLI', 'Proof of funds', 'Medical examination'],
        documents: ['Passport', 'Academic transcripts', 'IELTS scorecard', 'Statement of Purpose'],
        visaProcess: defaultProcess,
        timeline: defaultProcess,
        cost: [{ label: 'Tuition (avg)', value: 'CAD 20,000–35,000/year' }],
        scholarships: [],
        livingExpenses: [{ label: 'Living costs', value: 'CAD 12,000–15,000/year' }],
        testimonials: [],
        faqs: [{ question: 'How long does processing take?', answer: 'Typically 4-8 weeks after biometrics.' }],
        seo: { title: 'Study in Canada | Shyaam International', description: 'Expert Canada student visa guidance from Shyaam International.' },
      },
    },
    {
      slug: 'uk',
      name: 'United Kingdom',
      flag: '🇬🇧',
      content: {
        heroTitle: 'Study in the UK',
        heroSubtitle: 'Prestigious universities and vibrant student life.',
        overview: 'The UK is home to some of the worlds most prestigious universities, offering shorter degree durations and excellent graduate visa options for international students.',
        benefits: defaultBenefits,
        universities: [],
        popularCourses: [],
        eligibility: ['Minimum 55% in previous qualification', 'IELTS 6.0 or equivalent'],
        requirements: ['CAS from university', 'TB test certificate', 'Financial evidence'],
        documents: ['Passport', 'Academic transcripts', 'CAS letter', 'Financial documents'],
        visaProcess: defaultProcess,
        timeline: defaultProcess,
        cost: [{ label: 'Tuition (avg)', value: '£15,000–25,000/year' }],
        scholarships: [],
        livingExpenses: [{ label: 'Living costs', value: '£12,000–15,000/year' }],
        testimonials: [],
        faqs: [],
        seo: { title: 'Study in UK | Shyaam International', description: 'UK student visa consultancy from Shyaam International.' },
      },
    },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { slug: country.slug },
      update: { name: country.name, flag: country.flag, content: country.content },
      create: country,
    });
  }

  const services = [
    {
      slug: 'student-visa',
      name: 'Student Visa',
      content: {
        heroTitle: 'Student Visa Assistance',
        heroSubtitle: 'End-to-end support for your study abroad journey.',
        overview: 'Our student visa service covers university shortlisting, documentation, application filing, and interview preparation to maximize your approval chances.',
        whoIsItFor: ['First-time study abroad applicants', 'Students changing study destinations'],
        benefits: defaultBenefits,
        process: defaultProcess,
        documents: ['Passport', 'Offer letter', 'Financial proof', 'Academic records'],
        timeline: '4–12 weeks depending on destination',
        faqs: [{ question: 'Do you help with SOP?', answer: 'Yes, we provide SOP review and guidance.' }],
        seo: { title: 'Student Visa Services | Shyaam International', description: 'Expert student visa consultancy services.' },
      },
    },
    {
      slug: 'tourist-visa',
      name: 'Tourist Visa',
      content: {
        heroTitle: 'Tourist Visa Services',
        heroSubtitle: 'Hassle-free travel visa processing.',
        overview: 'We handle tourist visa applications with meticulous document preparation and embassy guideline compliance for smooth approvals.',
        whoIsItFor: ['Leisure travelers', 'Family vacation planners'],
        benefits: defaultBenefits,
        process: defaultProcess,
        documents: ['Passport', 'Travel itinerary', 'Bank statements', 'Employment proof'],
        timeline: '2–4 weeks',
        faqs: [],
        seo: { title: 'Tourist Visa Services | Shyaam International', description: 'Professional tourist visa assistance.' },
      },
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { name: service.name, content: service.content },
      create: service,
    });
  }

  const blogs = [
    {
      slug: 'canada-study-permit-guide',
      title: 'Complete Canada Study Permit Guide 2026',
      excerpt: 'Everything you need to know about applying for a Canadian study permit.',
      category: 'Visa Guides',
      author: 'Shyaam Team',
      publishedAt: new Date('2026-01-15'),
      readTime: '8 min',
      coverImage: '/images/blog-canada.jpg',
      tags: ['Canada', 'Study Permit'],
      body: 'A comprehensive guide to the Canadian study permit process...',
      status: 'published' as const,
      seo: { title: 'Canada Study Permit Guide 2026', description: 'Step-by-step Canada study permit application guide.' },
    },
    {
      slug: 'uk-graduate-visa',
      title: 'UK Graduate Route Visa Explained',
      excerpt: 'Understanding post-study work options in the United Kingdom.',
      category: 'Immigration',
      author: 'Shyaam Team',
      publishedAt: new Date('2026-02-01'),
      readTime: '6 min',
      coverImage: '/images/blog-uk.jpg',
      tags: ['UK', 'Graduate Visa'],
      body: 'The UK Graduate Route allows international students to work after graduation...',
      status: 'draft' as const,
      seo: { title: 'UK Graduate Route Visa', description: 'Post-study work visa options in the UK.' },
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }

  const now = new Date();
  const leads = [
    {
      type: 'contact' as const,
      status: 'new' as const,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      message: 'Interested in studying in Canada for MBA.',
      country: 'Canada',
      source: 'website',
    },
    {
      type: 'consultation' as const,
      status: 'contacted' as const,
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 91234 56789',
      service: 'Student Visa',
      country: 'UK',
      message: 'Need consultation for September intake.',
      source: 'website',
    },
    {
      type: 'newsletter' as const,
      status: 'qualified' as const,
      name: 'Amit Kumar',
      email: 'amit@example.com',
      source: 'footer',
    },
    {
      type: 'career' as const,
      status: 'new' as const,
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      phone: '+91 99887 76655',
      message: 'Applied for Visa Consultant role.',
      metadata: { position: 'Visa Consultant' },
      source: 'careers',
    },
  ];

  const existingLeads = await prisma.lead.count();
  if (existingLeads === 0) {
    for (const [index, lead] of leads.entries()) {
      await prisma.lead.create({
        data: {
          ...lead,
          createdAt: new Date(now.getTime() - index * 86400000),
        },
      });
    }
  }

  const settings = await prisma.setting.findFirst();
  if (!settings) {
    await prisma.setting.create({
      data: {
        data: {
          siteName: 'Shyaam International',
          contactEmail: 'info@shyaam.in',
          contactPhone: '+91 98765 43210',
        },
      },
    });
  }

  console.log('Seed completed.');
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
