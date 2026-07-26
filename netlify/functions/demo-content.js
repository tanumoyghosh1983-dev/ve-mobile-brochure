// Demo case study content — placeholder/demo data as agreed, mapped to each
// of the 16 CATEGORIES keys used by the cost estimator. Each category maps
// to the single most relevant case study; several categories intentionally
// share a case study where a real project would plausibly cover both.
const CASE_STUDIES = {
  fitness: {
    title: "FlexFit — On-Demand Training Platform",
    client: "A boutique fitness studio chain (demo case study)",
    summary: "We built a mobile app connecting members to live and on-demand workout classes, with trainer profiles, session booking, and progress tracking. Post-launch, the client reported a 34% increase in class attendance and a 22% reduction in member churn within the first quarter.",
    stack: "React Native, Node.js, PostgreSQL, Stripe",
    outcome: "34% increase in class attendance, 22% churn reduction",
  },
  dating: {
    title: "Kindled — Modern Matchmaking App",
    client: "An early-stage dating startup (demo case study)",
    summary: "We designed and built a swipe-based matching app with in-app messaging, identity verification, and a subscription-based boost system. The app reached 50,000 downloads within its first two months of launch.",
    stack: "Flutter, Firebase, Node.js",
    outcome: "50,000 downloads in first 2 months post-launch",
  },
  food: {
    title: "NoshNow — Local Food Delivery Marketplace",
    client: "A regional food delivery startup (demo case study)",
    summary: "We built a three-sided marketplace app connecting restaurants, delivery drivers, and customers, with live order tracking, dynamic delivery-fee calculation, and a restaurant partner dashboard. The platform onboarded 200+ restaurants within its first six months.",
    stack: "React Native, Node.js, MongoDB, Google Maps API",
    outcome: "200+ restaurant partners onboarded within 6 months",
  },
  healthcare: {
    title: "CarePath — Telemedicine Consultation App",
    client: "A telehealth network (demo case study)",
    summary: "We developed a HIPAA-conscious telemedicine app enabling video consultations, e-prescriptions, and patient record management between doctors and patients. The platform now supports over 15,000 consultations per month.",
    stack: "React Native, WebRTC, Node.js, PostgreSQL",
    outcome: "15,000+ consultations processed monthly",
  },
  ecommerce: {
    title: "MarketLoop — Multi-Vendor Marketplace App",
    client: "An e-commerce marketplace startup (demo case study)",
    summary: "We built a multi-vendor marketplace app with seller onboarding, product catalog management, and an integrated checkout and payments flow. Within the first year, the platform processed over $1.2M in gross merchandise value.",
    stack: "React Native, Node.js, PostgreSQL, Stripe Connect",
    outcome: "$1.2M+ in GMV processed in year one",
  },
  education: {
    title: "LearnLoop — Online Course Platform",
    client: "An online education provider (demo case study)",
    summary: "We built a course delivery app with live and recorded classes, quizzes, and progress tracking for students and instructors. Course completion rates improved by 40% after the app's mobile-first redesign.",
    stack: "React Native, Node.js, PostgreSQL, AWS S3",
    outcome: "40% improvement in course completion rates",
  },
  realestate: {
    title: "NestFind — Property Discovery App",
    client: "A regional real estate brokerage (demo case study)",
    summary: "We built a map-based property discovery app with agent dashboards, lead capture, and saved-search alerts. The brokerage reported a 28% increase in qualified lead volume within four months of launch.",
    stack: "React Native, Node.js, PostgreSQL, Mapbox",
    outcome: "28% increase in qualified leads within 4 months",
  },
  ride: {
    title: "GoNow — Ride-Hailing Platform",
    client: "A regional ride-hailing startup (demo case study)",
    summary: "We developed a two-sided rider and driver app with live trip tracking, dynamic fare calculation, and a dispatch operations dashboard. The platform scaled to over 5,000 daily rides within its first year of operation.",
    stack: "React Native, Node.js, PostgreSQL, Google Maps API",
    outcome: "5,000+ daily rides within year one",
  },
  logistics: {
    title: "ShipSwift — Fleet & Delivery Management App",
    client: "A logistics and last-mile delivery company (demo case study)",
    summary: "We built a fleet management and delivery tracking app with live shipment tracking, proof-of-delivery capture, and an operations dashboard. On-time delivery rates improved by 19% after launch.",
    stack: "React Native, Node.js, PostgreSQL, Google Maps API",
    outcome: "19% improvement in on-time delivery rate",
  },
  fintech: {
    title: "BalancePoint — Personal Finance & Wallet App",
    client: "A fintech startup (demo case study)",
    summary: "We built a secure wallet and payments app with KYC onboarding, transaction history, and fraud-detection safeguards. The app passed third-party security review with zero critical findings and now processes thousands of transactions monthly.",
    stack: "React Native, Node.js, PostgreSQL, Plaid",
    outcome: "Zero critical findings in third-party security audit",
  },
  booking: {
    title: "SlotWise — Appointment Booking Platform",
    client: "A multi-location service business (demo case study)",
    summary: "We built an appointment scheduling app with availability rules, staff profiles, and automated reminders. No-show rates dropped by 31% after automated reminders went live.",
    stack: "React Native, Node.js, PostgreSQL",
    outcome: "31% reduction in appointment no-shows",
  },
  travel: {
    title: "WanderWay — Travel Booking & Itinerary App",
    client: "A boutique travel agency (demo case study)",
    summary: "We built a travel booking app with search and filtering, itinerary building, and integrated payments. The agency reported a 45% increase in direct bookings through the app in its first season.",
    stack: "React Native, Node.js, PostgreSQL, Stripe",
    outcome: "45% increase in direct bookings in first season",
  },
  social: {
    title: "CircleUp — Community & Social Networking App",
    client: "A niche community platform (demo case study)",
    summary: "We built a social networking app with profiles, group feeds, messaging, and moderation tools. The platform grew to 10,000 active monthly users within its first quarter post-launch.",
    stack: "React Native, Node.js, PostgreSQL, Redis",
    outcome: "10,000 active monthly users within one quarter",
  },
  streaming: {
    title: "Wavelen — Media Streaming App",
    client: "An independent media streaming platform (demo case study)",
    summary: "We built a media streaming app with a content library, subscription management, and creator/admin controls. Average watch time per session increased by 25% after a playback-experience redesign.",
    stack: "React Native, Node.js, AWS MediaConvert, Stripe",
    outcome: "25% increase in average watch time per session",
  },
  business: {
    title: "FlowBoard — Business Workflow & Productivity App",
    client: "A mid-size operations team (demo case study)",
    summary: "We built a role-based workflow and task-approval app with dashboards and admin controls. Task turnaround time improved by 37% within two months of adoption.",
    stack: "React Native, Node.js, PostgreSQL",
    outcome: "37% improvement in task turnaround time",
  },
  custom: {
    title: "A Custom Platform, Built Around Your Workflow",
    client: "Various clients across industries (demo case study)",
    summary: "For projects that don't fit a standard category, we start with a discovery phase to map your core user flow, then build a tailored solution around it — from admin dashboards to custom integrations. Our custom builds have ranged from internal operations tools to entirely new consumer categories.",
    stack: "Tailored to project requirements",
    outcome: "Solutions tailored to unique business requirements",
  },
};

// "About VirtualEmployee" demo content, used in the proposal's company section.
const ABOUT_VE = {
  intro: "VirtualEmployee.com is a mobile and software development outsourcing company helping founders and businesses turn app ideas into real, market-ready products. For 18 years, we've delivered projects across fitness, fintech, healthcare, logistics, and dozens of other industries — combining senior engineering talent with a transparent, collaborative development process.",
  points: [
    "Dedicated senior development team assigned to your project, not a rotating pool of freelancers",
    "Transparent, milestone-based delivery — you see progress every step of the way",
    "Full IP ownership transfers to you upon project completion",
    "Post-launch support and maintenance plans available for every engagement",
  ],
  stats: [
    { value: "500+", label: "Apps delivered" },
    { value: "18+", label: "Years in business" },
  ],
};

module.exports = { CASE_STUDIES, ABOUT_VE };
