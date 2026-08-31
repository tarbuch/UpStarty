export const mockDepartments = [
  { id: 'dept-001', name: 'Municipal Corporation' },
  { id: 'dept-002', name: 'Department of Transportation' },
  { id: 'dept-003', name: 'Health & Human Services' },
  { id: 'dept-004', name: 'Public Works' }
];

export const mockUsers = [
  { id: 'user-001', name: 'Arjun Patel', role: 'Government Officer', departmentId: 'dept-001' },
  { id: 'user-002', name: 'Priya Sharma', role: 'Validator', departmentId: 'dept-001' },
  { id: 'user-003', name: 'Dr. John Smith', role: 'Expert', departmentId: 'dept-003' }
];

export const mockChallenges = [
  {
    id: 'challenge-001',
    title: 'Waste Collection Route Optimization',
    departmentId: 'dept-001',
    domain: 'Waste Management',
    location: 'Ahmedabad',
    status: 'PILOT',
    applications: 12,
    budget: 5000000,
    deadline: '2026-09-30',
    createdDate: '2026-08-01',
    problem: 'Our city has inefficient waste collection routes and citizens are reporting missed pickups.',
    objective: 'Optimize waste collection routes.',
    expectedOutcome: 'Reduce missed pickups and unnecessary route distance.',
    timeline: {
      applicationOpening: '2026-08-10',
      applicationDeadline: '2026-09-30',
      pilotDurationDays: 90,
      expectedPilotStart: '2026-10-15'
    },
    kpis: [
      { id: 'kpi-001', name: 'Missed Pickups', baseline: 100, target: 75, unit: 'pickups/month', measurement: 'Municipal records', isHigherBetter: false },
      { id: 'kpi-002', name: 'Route Distance', baseline: 500, target: 400, unit: 'km/day', measurement: 'GPS tracking', isHigherBetter: false },
      { id: 'kpi-003', name: 'Citizen Complaints', baseline: 50, target: 20, unit: 'complaints/month', measurement: 'Helpdesk logs', isHigherBetter: false }
    ],
    eligibilityRules: [
      { id: 'er-1', name: 'Company Registration', required: true, status: 'PASS' },
      { id: 'er-2', name: 'Conflict of Interest Declaration', required: true, status: 'PASS' },
      { id: 'er-3', name: 'Pilot Readiness', required: true, status: 'PASS' }
    ],
    evaluationCriteria: [
      { name: 'Problem-Solution Fit', weight: 30 },
      { name: 'Technical Feasibility', weight: 30 },
      { name: 'Cost Effectiveness', weight: 20 },
      { name: 'Pilot Readiness', weight: 20 }
    ]
  },
  {
    id: 'challenge-002',
    title: 'Traffic Signal AI Optimization',
    departmentId: 'dept-002',
    domain: 'Traffic Management',
    location: 'Surat',
    status: 'EVALUATION',
    applications: 24,
    budget: 2000000,
    deadline: '2026-10-15',
    createdDate: '2026-08-15',
    problem: 'High traffic congestion during peak hours at major intersections.',
    objective: 'Reduce wait times at traffic signals using AI-based adaptive control.',
    expectedOutcome: 'Smoother traffic flow and reduced carbon emissions from idling vehicles.',
    timeline: {
      applicationOpening: '2026-08-20',
      applicationDeadline: '2026-10-15',
      pilotDurationDays: 120,
      expectedPilotStart: '2026-11-01'
    },
    kpis: [
      { id: 'kpi-004', name: 'Average Wait Time', baseline: 4.5, target: 3.0, unit: 'minutes', measurement: 'Traffic sensors', isHigherBetter: false },
      { id: 'kpi-005', name: 'Intersection Throughput', baseline: 1200, target: 1500, unit: 'vehicles/hr', measurement: 'Camera analytics', isHigherBetter: true }
    ],
    eligibilityRules: [
      { id: 'er-4', name: 'Company Registration', required: true },
      { id: 'er-5', name: 'Data Security Certification (ISO 27001)', required: true }
    ],
    evaluationCriteria: [
      { name: 'Algorithm Accuracy', weight: 40 },
      { name: 'Scalability', weight: 20 },
      { name: 'Cost', weight: 20 },
      { name: 'Implementation Speed', weight: 20 }
    ]
  },
  {
    id: 'challenge-003',
    title: 'Water Leakage Detection System',
    departmentId: 'dept-004',
    domain: 'Water Management',
    location: 'Pune',
    status: 'APPLICATION_OPEN',
    applications: 8,
    budget: 3500000,
    deadline: '2026-11-30',
    createdDate: '2026-09-01',
    problem: 'Significant non-revenue water loss due to undetected underground pipe leakages.',
    objective: 'Deploy IoT acoustic sensors to identify and locate leaks early.',
    expectedOutcome: 'Reduce non-revenue water by 15%.',
    timeline: {
      applicationOpening: '2026-09-05',
      applicationDeadline: '2026-11-30',
      pilotDurationDays: 180,
      expectedPilotStart: '2027-01-15'
    },
    kpis: [
      { id: 'kpi-006', name: 'Leak Detection Time', baseline: 72, target: 12, unit: 'hours', measurement: 'System logs', isHigherBetter: false },
      { id: 'kpi-007', name: 'Non-Revenue Water', baseline: 25, target: 10, unit: '%', measurement: 'Flow meters', isHigherBetter: false }
    ],
    eligibilityRules: [
      { id: 'er-6', name: 'Hardware Certification', required: true }
    ],
    evaluationCriteria: [
      { name: 'Sensor Accuracy', weight: 50 },
      { name: 'Battery Life', weight: 20 },
      { name: 'Cost', weight: 30 }
    ]
  },
  {
    id: 'challenge-004',
    title: 'Digital Health Records for Rural Clinics',
    departmentId: 'dept-003',
    domain: 'Healthcare',
    location: 'Rural Gujarat',
    status: 'COMPLETED',
    applications: 18,
    budget: 1200000,
    deadline: '2026-05-01',
    createdDate: '2026-01-10',
    problem: 'Lack of digitized health records makes tracking patient history difficult across different clinics.',
    objective: 'Implement a lightweight, offline-first digital health record system.',
    expectedOutcome: '100% of participating clinics using digital records.',
    timeline: {
      applicationOpening: '2026-01-15',
      applicationDeadline: '2026-03-01',
      pilotDurationDays: 90,
      expectedPilotStart: '2026-04-01'
    },
    kpis: [
      { id: 'kpi-008', name: 'Adoption Rate', baseline: 0, target: 90, unit: '%', measurement: 'System usage', isHigherBetter: true }
    ],
    eligibilityRules: [],
    evaluationCriteria: [
      { name: 'Ease of Use', weight: 40 },
      { name: 'Offline Capability', weight: 40 },
      { name: 'Cost', weight: 20 }
    ]
  },
  {
    id: 'challenge-005',
    title: 'Automated Property Tax Assessment',
    departmentId: 'dept-001',
    domain: 'Urban Planning',
    location: 'Ahmedabad',
    status: 'DRAFT',
    applications: 0,
    budget: 4000000,
    deadline: '2026-12-31',
    createdDate: '2026-08-30',
    problem: 'Manual property tax assessments are slow and prone to human error or corruption.',
    objective: '',
    expectedOutcome: '',
    timeline: {
      applicationOpening: '2026-10-01',
      applicationDeadline: '2026-12-31',
      pilotDurationDays: 120,
      expectedPilotStart: '2027-02-01'
    },
    kpis: [],
    eligibilityRules: [],
    evaluationCriteria: []
  },
  {
    id: 'challenge-006',
    title: 'Smart Street Lighting Automation',
    departmentId: 'dept-004',
    domain: 'Energy',
    location: 'Surat',
    status: 'PUBLISHED',
    applications: 0,
    budget: 8000000,
    deadline: '2026-12-15',
    createdDate: '2026-08-25',
    problem: 'Street lights consume excessive energy as they operate at full capacity regardless of ambient light or traffic.',
    objective: 'Implement smart dimming and motion sensing for street lights.',
    expectedOutcome: 'Reduce energy consumption by 30%.',
    timeline: {
      applicationOpening: '2026-10-01',
      applicationDeadline: '2026-12-15',
      pilotDurationDays: 180,
      expectedPilotStart: '2027-02-15'
    },
    kpis: [
      { id: 'kpi-009', name: 'Energy Consumption', baseline: 5000, target: 3500, unit: 'kWh/month', measurement: 'Smart meters', isHigherBetter: false }
    ],
    eligibilityRules: [
      { id: 'er-7', name: 'Company Registration', required: true }
    ],
    evaluationCriteria: [
      { name: 'Energy Savings', weight: 40 },
      { name: 'Hardware Reliability', weight: 40 },
      { name: 'Cost', weight: 20 }
    ]
  },
  {
    id: 'challenge-007',
    title: 'Air Quality Monitoring Network',
    departmentId: 'dept-003',
    domain: 'Environment',
    location: 'Ahmedabad',
    status: 'STARTUP_SELECTED',
    applications: 15,
    budget: 2500000,
    deadline: '2026-07-31',
    createdDate: '2026-06-01',
    problem: 'Inadequate spatial resolution of air quality data to identify local pollution hotspots.',
    objective: 'Deploy low-cost PM2.5 and PM10 sensors across 50 locations.',
    expectedOutcome: 'High-resolution real-time air quality map.',
    timeline: {
      applicationOpening: '2026-06-15',
      applicationDeadline: '2026-07-31',
      pilotDurationDays: 90,
      expectedPilotStart: '2026-09-15'
    },
    kpis: [
      { id: 'kpi-010', name: 'Network Uptime', baseline: 0, target: 99, unit: '%', measurement: 'System logs', isHigherBetter: true },
      { id: 'kpi-011', name: 'Data Accuracy (vs Ref)', baseline: 50, target: 90, unit: '% correlation', measurement: 'Co-location test', isHigherBetter: true }
    ],
    eligibilityRules: [
      { id: 'er-8', name: 'Company Registration', required: true }
    ],
    evaluationCriteria: [
      { name: 'Sensor Accuracy', weight: 40 },
      { name: 'Platform Usability', weight: 30 },
      { name: 'Cost', weight: 30 }
    ]
  },
  {
    id: 'challenge-008',
    title: 'Public Transit Passenger Counting',
    departmentId: 'dept-002',
    domain: 'Transportation',
    location: 'Pune',
    status: 'CLOSED',
    applications: 9,
    budget: 1800000,
    deadline: '2026-04-30',
    createdDate: '2026-02-15',
    problem: 'Manual ticket counting does not accurately reflect passenger loads at different stops.',
    objective: 'Implement automated passenger counting (APC) on buses.',
    expectedOutcome: 'Accurate load profiles to optimize bus scheduling.',
    timeline: {
      applicationOpening: '2026-03-01',
      applicationDeadline: '2026-04-30',
      pilotDurationDays: 60,
      expectedPilotStart: '2026-06-01'
    },
    kpis: [
      { id: 'kpi-012', name: 'Counting Accuracy', baseline: 0, target: 95, unit: '%', measurement: 'Manual audit', isHigherBetter: true }
    ],
    eligibilityRules: [],
    evaluationCriteria: [
      { name: 'Accuracy', weight: 60 },
      { name: 'Cost', weight: 40 }
    ]
  }
];

export const mockStartups = [
  {
    id: 'startup-001',
    name: 'EcoRoute AI',
    description: 'AI-powered waste management routing platform optimizing municipal logistics.',
    technologies: ['AI', 'GPS', 'IoT', 'Machine Learning'],
    domain: 'Waste Management',
    location: 'Bangalore',
    maturity: 'Series A',
    deployments: 5,
    governmentDeployments: 2,
    pilotReadiness: 'High',
    certifications: ['ISO 27001', 'ISO 9001'],
    capabilities: [
      'Waste-management domain experience',
      'Route optimization capability',
      'Real-time tracking',
      'Citizen reporting integration',
      'Previous municipal deployment',
      'Pilot-ready team'
    ]
  },
  {
    id: 'startup-002',
    name: 'TrafikFlow',
    description: 'Computer vision-based adaptive traffic signal control system.',
    technologies: ['Computer Vision', 'Edge AI', 'IoT'],
    domain: 'Traffic Management',
    location: 'Pune',
    maturity: 'Seed',
    deployments: 2,
    governmentDeployments: 0,
    pilotReadiness: 'High',
    certifications: [],
    capabilities: [
      'Edge computing',
      'Traffic camera integration',
      'Adaptive signal control algorithms'
    ]
  },
  {
    id: 'startup-003',
    name: 'AquaSense',
    description: 'Acoustic IoT sensors for underground pipe leak detection.',
    technologies: ['IoT', 'Acoustics', 'LoRaWAN'],
    domain: 'Water Management',
    location: 'Chennai',
    maturity: 'Pre-Seed',
    deployments: 1,
    governmentDeployments: 0,
    pilotReadiness: 'Medium',
    certifications: ['Hardware Safety Certified'],
    capabilities: [
      'Acoustic signal processing',
      'Low power IoT',
      'Leak pinpointing software'
    ]
  },
  {
    id: 'startup-004',
    name: 'HealthSync',
    description: 'Offline-first digital health record system for rural deployments.',
    technologies: ['React Native', 'CouchDB', 'Local-first architecture'],
    domain: 'Healthcare',
    location: 'Hyderabad',
    maturity: 'Series B',
    deployments: 12,
    governmentDeployments: 4,
    pilotReadiness: 'High',
    certifications: ['HIPAA Compliant', 'ISO 27001'],
    capabilities: [
      'Offline sync',
      'Multilingual interface',
      'Medical data standards compliance'
    ]
  },
  {
    id: 'startup-005',
    name: 'AeroBreathe',
    description: 'Low-cost, high-accuracy air quality monitoring networks.',
    technologies: ['Sensors', 'Data Analytics', 'Cloud'],
    domain: 'Environment',
    location: 'Delhi',
    maturity: 'Seed',
    deployments: 4,
    governmentDeployments: 1,
    pilotReadiness: 'High',
    certifications: ['CE', 'RoHS'],
    capabilities: [
      'PM2.5 / PM10 sensing',
      'Data visualization dashboard',
      'API integration'
    ]
  },
  {
    id: 'startup-006',
    name: 'CleanCity Logistics',
    description: 'Fleet management software for waste collection vehicles.',
    technologies: ['GPS', 'Cloud', 'Mobile App'],
    domain: 'Waste Management',
    location: 'Mumbai',
    maturity: 'Seed',
    deployments: 3,
    governmentDeployments: 1,
    pilotReadiness: 'High',
    certifications: [],
    capabilities: [
      'Fleet tracking',
      'Driver behavior monitoring',
      'Basic route planning'
    ]
  },
  {
    id: 'startup-007',
    name: 'Lumiere SmartTech',
    description: 'Smart controllers for street lighting automation.',
    technologies: ['IoT', 'Power Electronics', 'LoRa'],
    domain: 'Energy',
    location: 'Ahmedabad',
    maturity: 'Series A',
    deployments: 8,
    governmentDeployments: 3,
    pilotReadiness: 'High',
    certifications: ['ISO 9001'],
    capabilities: [
      'Dimming control',
      'Fault detection',
      'Energy usage reporting'
    ]
  },
  {
    id: 'startup-008',
    name: 'CountMeIn Vision',
    description: 'Edge AI passenger counting systems for transit vehicles.',
    technologies: ['Edge AI', 'Stereo Vision', 'Cellular'],
    domain: 'Transportation',
    location: 'Bangalore',
    maturity: 'Seed',
    deployments: 2,
    governmentDeployments: 0,
    pilotReadiness: 'High',
    certifications: [],
    capabilities: [
      '95%+ accuracy counting',
      'Real-time load data',
      'Ruggedized hardware'
    ]
  }
];

export const mockApplications = [
  {
    id: 'application-001',
    challengeId: 'challenge-001',
    startupId: 'startup-001', // EcoRoute AI
    status: 'SELECTED',
    matchScore: 94,
    expertScore: 8.5,
    submittedDate: '2026-08-25',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDetails: [
      { ruleId: 'er-1', status: 'PASS', notes: 'Verified GST and PAN.' },
      { ruleId: 'er-2', status: 'PASS', notes: 'No conflicts declared.' },
      { ruleId: 'er-3', status: 'PASS', notes: 'Team is ready.' }
    ],
    aiSummary: {
      problemUnderstanding: 'Strong understanding of municipal waste challenges, explicitly addressing missed pickups and route overlap.',
      solutionApproach: 'Deploy GPS tracking on 20 trucks and run dynamic optimization algorithms daily.',
      strengths: ['Proven technology in 2 other cities', 'Comprehensive dashboard'],
      weaknesses: ['Requires mobile app installation by drivers'],
      missingInformation: ['Specific API details for integrating with existing complaint system.'],
      risks: ['Driver adoption may be low without training.']
    }
  },
  {
    id: 'application-002',
    challengeId: 'challenge-001',
    startupId: 'startup-006', // CleanCity Logistics
    status: 'REJECTED',
    matchScore: 72,
    expertScore: 6.2,
    submittedDate: '2026-08-28',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDetails: [
      { ruleId: 'er-1', status: 'PASS', notes: 'Valid.' },
      { ruleId: 'er-2', status: 'PASS', notes: 'Valid.' },
      { ruleId: 'er-3', status: 'PASS', notes: 'Valid.' }
    ],
    aiSummary: {
      problemUnderstanding: 'Focuses more on vehicle tracking than route optimization.',
      solutionApproach: 'Provide GPS trackers and a web dashboard for supervisors.',
      strengths: ['Low cost', 'Easy installation'],
      weaknesses: ['Lacks AI route optimization engine'],
      missingInformation: [],
      risks: ['May not actually reduce route distance, only monitor it.']
    }
  },
  {
    id: 'application-003',
    challengeId: 'challenge-002',
    startupId: 'startup-002', // TrafikFlow
    status: 'UNDER_EVALUATION',
    matchScore: 88,
    expertScore: null,
    submittedDate: '2026-09-10',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDetails: [
      { ruleId: 'er-4', status: 'PASS', notes: 'Valid.' },
      { ruleId: 'er-5', status: 'PASS', notes: 'Valid ISO27001.' }
    ],
    aiSummary: {
      problemUnderstanding: 'Clear understanding of intersection bottleneck causes.',
      solutionApproach: 'Install edge-AI cameras at 5 intersections to dynamically adjust green times.',
      strengths: ['Does not require cloud latency', 'Works with existing signals'],
      weaknesses: ['Hardware cost per intersection is high'],
      missingInformation: ['Maintenance plan for edge devices'],
      risks: ['Camera obstruction due to weather or dust']
    }
  },
  {
    id: 'application-004',
    challengeId: 'challenge-003',
    startupId: 'startup-003', // AquaSense
    status: 'SUBMITTED',
    matchScore: 91,
    expertScore: null,
    submittedDate: '2026-09-12',
    eligibilityStatus: 'PENDING',
    eligibilityDetails: [
      { ruleId: 'er-6', status: 'PENDING', notes: '' }
    ],
    aiSummary: {
      problemUnderstanding: 'Expertise in acoustic properties of underground pipelines.',
      solutionApproach: 'Deploy 50 acoustic sensors along critical mains, transmitting data via LoRaWAN.',
      strengths: ['High accuracy claim', 'Low power 5-year battery'],
      weaknesses: ['Pre-seed stage, limited deployment history'],
      missingInformation: ['Installation process specifics'],
      risks: ['Startup maturity may impact delivery capacity']
    }
  },
  {
    id: 'application-005',
    challengeId: 'challenge-007',
    startupId: 'startup-005', // AeroBreathe
    status: 'SELECTED',
    matchScore: 89,
    expertScore: 8.1,
    submittedDate: '2026-06-20',
    eligibilityStatus: 'ELIGIBLE',
    eligibilityDetails: [
      { ruleId: 'er-8', status: 'PASS', notes: 'Valid.' }
    ],
    aiSummary: {
      problemUnderstanding: 'Focuses on hyper-local air quality variations.',
      solutionApproach: 'Deploy 50 solar-powered PM sensors on street poles.',
      strengths: ['Solar powered', 'API ready'],
      weaknesses: ['Sensor drift over time requires recalibration'],
      missingInformation: [],
      risks: ['Vandalism of street-level units']
    }
  }
];

export const mockEvaluations = [
  {
    id: 'eval-001',
    applicationId: 'application-001',
    expertId: 'user-003',
    status: 'COMPLETED',
    overallScore: 8.5,
    submittedDate: '2026-09-05',
    scores: {
      'Problem-Solution Fit': 9,
      'Technical Feasibility': 8,
      'Cost Effectiveness': 8,
      'Pilot Readiness': 9
    },
    comments: 'Excellent proposal. The routing algorithm has been proven in similar urban environments. Cost is slightly high but justifiable by the expected ROI.'
  },
  {
    id: 'eval-002',
    applicationId: 'application-002',
    expertId: 'user-003',
    status: 'COMPLETED',
    overallScore: 6.2,
    submittedDate: '2026-09-06',
    scores: {
      'Problem-Solution Fit': 5,
      'Technical Feasibility': 7,
      'Cost Effectiveness': 8,
      'Pilot Readiness': 5
    },
    comments: 'The solution is just a tracker. It does not actually solve the optimization problem posed by the challenge.'
  },
  {
    id: 'eval-003',
    applicationId: 'application-005',
    expertId: 'user-003',
    status: 'COMPLETED',
    overallScore: 8.1,
    submittedDate: '2026-07-01',
    scores: {
      'Sensor Accuracy': 7,
      'Platform Usability': 9,
      'Cost': 8
    },
    comments: 'Good overall package. We will need to monitor sensor drift during the pilot.'
  }
];

export const mockPilots = [
  {
    id: 'pilot-001',
    challengeId: 'challenge-001',
    startupId: 'startup-001', // EcoRoute AI
    name: 'Waste Management Optimization Pilot',
    location: 'Ahmedabad - West Zone',
    durationDays: 90,
    daysElapsed: 47,
    progress: 52,
    kpiStatus: 'ON_TRACK',
    status: 'ACTIVE',
    startDate: '2026-10-15',
    budget: 1500000,
    kpiResults: [
      { kpiId: 'kpi-001', actual: 68, status: 'TARGET_ACHIEVED' }, // target 75, lower is better -> Achieved!
      { kpiId: 'kpi-002', actual: 420, status: 'ON_TRACK' },       // target 400, baseline 500, lower is better -> On track
      { kpiId: 'kpi-003', actual: 25, status: 'ON_TRACK' }         // target 20, baseline 50, lower is better -> On track
    ],
    milestones: [
      { id: 'm-1', name: 'Software Integration & Training', dueDate: '2026-10-30', status: 'COMPLETED', paymentAmount: 300000, paymentStatus: 'RELEASED' },
      { id: 'm-2', name: 'Phase 1 Rollout (10 trucks)', dueDate: '2026-11-15', status: 'COMPLETED', paymentAmount: 400000, paymentStatus: 'RELEASED' },
      { id: 'm-3', name: 'Mid-Pilot KPI Review', dueDate: '2026-12-01', status: 'PENDING_VERIFICATION', paymentAmount: 400000, paymentStatus: 'PENDING' },
      { id: 'm-4', name: 'Final Validation & Report', dueDate: '2027-01-15', status: 'PENDING', paymentAmount: 400000, paymentStatus: 'PENDING' }
    ]
  },
  {
    id: 'pilot-002',
    challengeId: 'challenge-007',
    startupId: 'startup-005', // AeroBreathe
    name: 'Air Quality Network Deployment',
    location: 'Ahmedabad - Citywide',
    durationDays: 90,
    daysElapsed: 90,
    progress: 100,
    kpiStatus: 'TARGET_ACHIEVED',
    status: 'VALIDATION',
    startDate: '2026-09-15',
    budget: 800000,
    kpiResults: [
      { kpiId: 'kpi-010', actual: 99.5, status: 'TARGET_ACHIEVED' }, // target 99, higher is better
      { kpiId: 'kpi-011', actual: 92, status: 'TARGET_ACHIEVED' }    // target 90, higher is better
    ],
    milestones: [
      { id: 'm-5', name: 'Sensor Installation', dueDate: '2026-09-30', status: 'COMPLETED', paymentAmount: 400000, paymentStatus: 'RELEASED' },
      { id: 'm-6', name: 'Dashboard Integration', dueDate: '2026-10-15', status: 'COMPLETED', paymentAmount: 200000, paymentStatus: 'RELEASED' },
      { id: 'm-7', name: 'Final Data Validation', dueDate: '2026-12-15', status: 'COMPLETED', paymentAmount: 200000, paymentStatus: 'PENDING' }
    ]
  }
];

export const mockEvidence = [
  {
    id: 'ev-001',
    pilotId: 'pilot-001',
    milestoneId: 'm-1',
    title: 'Training Completion Sign-offs',
    uploader: 'EcoRoute AI',
    date: '2026-10-29',
    status: 'VERIFIED',
    notes: 'Signed attendance sheets from 25 drivers.'
  },
  {
    id: 'ev-002',
    pilotId: 'pilot-001',
    milestoneId: 'm-3',
    title: 'Mid-pilot KPI Report',
    uploader: 'EcoRoute AI',
    date: '2026-11-28',
    status: 'UNDER_REVIEW',
    notes: 'System generated report showing 68 missed pickups average.'
  },
  {
    id: 'ev-003',
    pilotId: 'pilot-002',
    milestoneId: 'm-7',
    title: 'Co-location Accuracy Test Results',
    uploader: 'AeroBreathe',
    date: '2026-12-14',
    status: 'VERIFIED',
    notes: 'Compared to reference grade monitor over 7 days. R2 = 0.92.'
  }
];

export const mockValidations = [
  {
    id: 'validation-001',
    pilotId: 'pilot-002', // AeroBreathe
    status: 'VALIDATED',
    submittedDate: '2026-12-20',
    validatorId: 'user-002',
    results: [
      { kpiId: 'kpi-010', validatorActual: 99.2, matched: true, notes: 'Logs verified.' },
      { kpiId: 'kpi-011', validatorActual: 91.5, matched: true, notes: 'Independent test confirms R2 > 0.90.' }
    ],
    overallNotes: 'The pilot successfully met all technical requirements. The sensors required cleaning once, which should be factored into operational scale costs.'
  }
];

export const mockDecisions = [
  {
    id: 'decision-001',
    pilotId: 'pilot-002', // AeroBreathe
    status: 'PENDING', // Awaiting Government action
    aiRecommendation: 'SCALE',
    aiReasons: [
      'KPI targets achieved and independently validated.',
      'Deployment was completed on time and within budget.',
      'Strong citizen demand for localized AQ data.'
    ],
    aiRisks: [
      'Long-term maintenance cost for sensor cleaning.'
    ],
    governmentDecision: null,
    governmentReason: null,
    decisionDate: null
  }
];

export const mockActivity = [
  { id: 'act-1', type: 'CHALLENGE_CREATED', title: 'Challenge created', entity: 'Automated Property Tax Assessment', time: '2 days ago' },
  { id: 'act-2', type: 'APPLICATION_SUBMITTED', title: 'Application submitted', entity: 'AquaSense for Water Leakage', time: '3 days ago' },
  { id: 'act-3', type: 'EVALUATION_SUBMITTED', title: 'Expert evaluation submitted', entity: 'TrafikFlow', time: '4 days ago' },
  { id: 'act-4', type: 'VALIDATION_COMPLETED', title: 'Pilot Validation Completed', entity: 'Air Quality Network Deployment', time: '1 week ago' }
];

export const mockNotifications = [
  { id: 'notif-1', type: 'ACTION_REQUIRED', message: 'EcoRoute AI submitted mid-pilot evidence for verification.', link: '/government/pilots/pilot-001/milestones', read: false },
  { id: 'notif-2', type: 'ACTION_REQUIRED', message: 'Scale decision pending for Air Quality Network Deployment.', link: '/government/decisions', read: false },
  { id: 'notif-3', type: 'INFO', message: 'AquaSense submitted application for Water Leakage.', link: '/government/applications/application-004', read: true }
];

export const mockAuditTrail = [
  { id: 'audit-1', date: 'Aug 01', action: 'Challenge created', entity: 'Waste Collection Route Optimization', actor: 'Arjun Patel', role: 'Government Officer' },
  { id: 'audit-2', date: 'Aug 10', action: 'Challenge published', entity: 'Waste Collection Route Optimization', actor: 'Arjun Patel', role: 'Government Officer' },
  { id: 'audit-3', date: 'Aug 25', action: 'Application submitted', entity: 'EcoRoute AI', actor: 'Startup', role: 'Applicant' },
  { id: 'audit-4', date: 'Sep 05', action: 'Evaluation completed', entity: 'EcoRoute AI Application', actor: 'Dr. John Smith', role: 'Expert' },
  { id: 'audit-5', date: 'Sep 10', action: 'Startup Selected', entity: 'EcoRoute AI', actor: 'Arjun Patel', role: 'Government Officer' },
  { id: 'audit-6', date: 'Oct 15', action: 'Pilot Started', entity: 'Waste Management Optimization Pilot', actor: 'System', role: 'System' }
];

export const mockPassports = [
  {
    startupId: 'startup-001',
    readinessScore: 86,
    profileCompleted: true,
    capabilitiesCompleted: true,
    technologiesCompleted: true,
    deploymentsCompleted: true,
    certificationsCompleted: false,
    documentsCompleted: true,
    documents: [
      { id: 'doc-1', name: 'Certificate of Incorporation.pdf', type: 'Registration', status: 'VERIFIED', uploadedDate: '2026-01-10' },
      { id: 'doc-2', name: 'ISO 27001 Certificate.pdf', type: 'Certification', status: 'VERIFIED', uploadedDate: '2026-02-15' },
      { id: 'doc-3', name: 'Conflict of Interest Declaration.pdf', type: 'Declaration', status: 'PENDING_VERIFICATION', uploadedDate: '2026-08-01' }
    ]
  }
];
