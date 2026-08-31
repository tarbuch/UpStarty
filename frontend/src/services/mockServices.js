import {
  mockChallenges as initChallenges,
  mockStartups as initStartups,
  mockApplications as initApplications,
  mockPilots as initPilots,
  mockValidations as initValidations,
  mockActivity as initActivity,
  mockNotifications as initNotifications,
  mockEvaluations as initEvaluations,
  mockEvidence as initEvidence,
  mockDecisions as initDecisions,
  mockAuditTrail as initAudit
} from '../data/mockData';

// In-memory state for the session
let challenges = [...initChallenges];
let startups = [...initStartups];
let applications = [...initApplications];
let pilots = [...initPilots];
let validations = [...initValidations];
let activity = [...initActivity];
let notifications = [...initNotifications];
let evaluations = [...initEvaluations];
let evidenceList = [...initEvidence];
let decisions = [...initDecisions];
let auditTrail = [...initAudit];

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const addAudit = (action, entity, actor, role) => {
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  auditTrail.unshift({ id: `audit-${Date.now()}`, date: dateStr, action, entity, actor, role });
  activity.unshift({ id: `act-${Date.now()}`, type: action.toUpperCase().replace(/\s+/g, '_'), title: action, entity, time: 'Just now' });
};

export const challengeService = {
  getChallenges: async () => {
    await delay();
    return [...challenges];
  },
  getChallengeById: async (id) => {
    await delay();
    return challenges.find(c => c.id === id);
  },
  saveDraft: async (challenge) => {
    await delay(800);
    const newChallenge = { ...challenge, id: `challenge-${Date.now()}`, createdDate: new Date().toISOString().split('T')[0], status: 'DRAFT', applications: 0 };
    challenges.unshift(newChallenge);
    addAudit('Challenge draft saved', newChallenge.title, 'Arjun Patel', 'Government Officer');
    return newChallenge;
  },
  createChallenge: async (challenge) => {
    await delay(1000);
    const newChallenge = { ...challenge, id: `challenge-${Date.now()}`, createdDate: new Date().toISOString().split('T')[0], status: 'PUBLISHED', applications: 0 };
    challenges.unshift(newChallenge);
    addAudit('Challenge published', newChallenge.title, 'Arjun Patel', 'Government Officer');
    return newChallenge;
  },
  generateAIStructure: async (problemDescription) => {
    await delay(2000);
    return {
      problem: problemDescription,
      objective: 'Optimize operations based on AI analysis of the provided problem statement.',
      expectedOutcome: 'A measurable improvement of at least 20% in core efficiency metrics.',
      kpis: [
        { id: `gen-kpi-${Date.now()}-1`, name: 'Operational Efficiency', baseline: 100, target: 80, unit: 'index', measurement: 'System logs', isHigherBetter: false },
        { id: `gen-kpi-${Date.now()}-2`, name: 'Resource Utilization', baseline: 50, target: 85, unit: '%', measurement: 'Telemetry data', isHigherBetter: true }
      ],
      pilotDurationDays: 90
    };
  }
};

export const startupService = {
  getStartups: async () => {
    await delay();
    return [...startups];
  },
  getStartupById: async (id) => {
    await delay();
    return startups.find(s => s.id === id);
  },
  matchStartupsForChallenge: async (challengeId) => {
    await delay(1500);
    const challenge = challenges.find(c => c.id === challengeId);
    return startups.map(s => {
      // Very basic deterministic mock matching logic based on domain
      let score = 50 + Math.floor(Math.random() * 20);
      if (s.domain === challenge?.domain) score += 20;
      if (s.deployments > 2) score += 5;
      return { 
        ...s, 
        matchScore: score,
        matchAnalysis: {
          overallScore: score,
          technologyFit: score > 80 ? 'Excellent' : 'Moderate',
          domainExperience: s.domain === challenge?.domain ? 'Direct Match' : 'Adjacent',
          reasons: [
            s.domain === challenge?.domain ? 'Strong domain alignment' : 'Technology translates well to this domain',
            s.deployments > 0 ? 'Proven deployment history' : 'Innovative but untested'
          ],
          concerns: s.governmentDeployments === 0 ? ['No prior government deployments'] : []
        }
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }
};

export const applicationService = {
  getApplications: async () => {
    await delay();
    return [...applications];
  },
  getApplicationsForChallenge: async (challengeId) => {
    await delay();
    return applications.filter(a => a.challengeId === challengeId);
  },
  getApplicationById: async (id) => {
    await delay();
    return applications.find(a => a.id === id);
  },
  updateEligibility: async (id, status, details) => {
    await delay(800);
    const app = applications.find(a => a.id === id);
    if (app) {
      app.eligibilityStatus = status;
      app.eligibilityDetails = details;
      if (status === 'ELIGIBLE') {
        app.status = 'UNDER_EVALUATION';
      } else if (status === 'INELIGIBLE') {
        app.status = 'REJECTED';
      }
      addAudit(`Eligibility ${status.toLowerCase()}`, `App ${id}`, 'Arjun Patel', 'Government Officer');
    }
    return app;
  },
  selectStartup: async (id) => {
    await delay(1000);
    const app = applications.find(a => a.id === id);
    if (app) {
      app.status = 'SELECTED';
      const challenge = challenges.find(c => c.id === app.challengeId);
      if (challenge) challenge.status = 'STARTUP_SELECTED';
      
      const startup = startups.find(s => s.id === app.startupId);
      addAudit('Startup selected', startup?.name || `App ${id}`, 'Arjun Patel', 'Government Officer');
    }
    return app;
  }
};

export const evaluationService = {
  getEvaluations: async () => {
    await delay();
    return [...evaluations];
  },
  getEvaluationsForApplication: async (appId) => {
    await delay();
    return evaluations.filter(e => e.applicationId === appId);
  }
};

export const pilotService = {
  getPilots: async () => {
    await delay();
    return [...pilots];
  },
  getPilotById: async (id) => {
    await delay();
    return pilots.find(p => p.id === id);
  },
  createPilot: async (data) => {
    await delay(1200);
    const newPilot = {
      id: `pilot-${Date.now()}`,
      challengeId: data.challengeId,
      startupId: data.startupId,
      name: data.name,
      location: data.location,
      durationDays: data.durationDays,
      daysElapsed: 0,
      progress: 0,
      kpiStatus: 'ON_TRACK',
      status: 'PLANNED',
      startDate: data.startDate,
      budget: data.budget,
      kpiResults: data.kpis.map(k => ({ kpiId: k.id, actual: k.baseline, status: 'ON_TRACK' })),
      milestones: data.milestones.map((m, i) => ({ id: `m-new-${i}`, name: m.name, dueDate: m.dueDate, status: 'PENDING', paymentAmount: m.payment, paymentStatus: 'PENDING' }))
    };
    pilots.unshift(newPilot);
    
    const challenge = challenges.find(c => c.id === data.challengeId);
    if(challenge) challenge.status = 'PILOT';
    
    addAudit('Pilot created', newPilot.name, 'Arjun Patel', 'Government Officer');
    return newPilot;
  },
  verifyMilestone: async (pilotId, milestoneId) => {
    await delay(800);
    const pilot = pilots.find(p => p.id === pilotId);
    if (pilot) {
      const milestone = pilot.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.status = 'COMPLETED';
        addAudit('Milestone verified', milestone.name, 'Arjun Patel', 'Government Officer');
      }
    }
    return pilot;
  },
  releasePayment: async (pilotId, milestoneId) => {
    await delay(1000);
    const pilot = pilots.find(p => p.id === pilotId);
    if (pilot) {
      const milestone = pilot.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.paymentStatus = 'RELEASED';
        addAudit('Payment released', milestone.name, 'Arjun Patel', 'Government Officer');
      }
    }
    return pilot;
  }
};

export const kpiService = {
  updateKPI: async (pilotId, kpiId, actualVal, evidenceUrl = null) => {
    await delay(800);
    const pilot = pilots.find(p => p.id === pilotId);
    if (pilot) {
      const kpi = pilot.kpiResults.find(k => k.kpiId === kpiId);
      if (kpi) {
        kpi.actual = actualVal;
        
        // Lookup target & baseline from challenge to set status
        const challenge = challenges.find(c => c.id === pilot.challengeId);
        const def = challenge?.kpis.find(k => k.id === kpiId);
        
        if (def) {
          if (def.isHigherBetter) {
            if (actualVal >= def.target) kpi.status = 'TARGET_ACHIEVED';
            else if (actualVal < def.baseline) kpi.status = 'FAILED';
            else kpi.status = 'ON_TRACK';
          } else {
            if (actualVal <= def.target) kpi.status = 'TARGET_ACHIEVED';
            else if (actualVal > def.baseline) kpi.status = 'FAILED';
            else kpi.status = 'ON_TRACK';
          }
        }
        addAudit('KPI updated', def?.name || 'KPI', 'Arjun Patel', 'Government Officer');
      }
    }
    return pilot;
  }
}

export const evidenceService = {
  getEvidence: async () => {
    await delay();
    return [...evidenceList];
  },
  getEvidenceForPilot: async (pilotId) => {
    await delay();
    return evidenceList.filter(e => e.pilotId === pilotId);
  }
};

export const validationService = {
  getValidations: async () => {
    await delay();
    return [...validations];
  }
};

export const decisionService = {
  getDecisions: async () => {
    await delay();
    return [...decisions];
  },
  recommendScaleDecision: async (pilotId) => {
    await delay(2000);
    const pilot = pilots.find(p => p.id === pilotId);
    const isSuccess = pilot?.kpiResults.every(k => k.status === 'TARGET_ACHIEVED');
    return {
      recommendation: isSuccess ? 'SCALE' : 'EXTEND',
      reasons: isSuccess ? [
        'All KPI targets achieved successfully.',
        'Independent validation passed.',
        'Cost within approved budget.'
      ] : [
        'Some KPIs have not met targets yet.',
        'More data required for conclusive validation.'
      ],
      risks: ['Scalability across different city zones requires further assessment.']
    };
  },
  confirmDecision: async (pilotId, decisionVal, reason) => {
    await delay(1000);
    const dec = decisions.find(d => d.pilotId === pilotId);
    if (dec) {
      dec.status = 'COMPLETED';
      dec.governmentDecision = decisionVal;
      dec.governmentReason = reason;
      dec.decisionDate = new Date().toISOString().split('T')[0];
    } else {
      decisions.push({
        id: `decision-${Date.now()}`,
        pilotId,
        status: 'COMPLETED',
        governmentDecision: decisionVal,
        governmentReason: reason,
        decisionDate: new Date().toISOString().split('T')[0]
      });
    }
    
    // Update pilot status
    const pilot = pilots.find(p => p.id === pilotId);
    if (pilot) {
      if (decisionVal === 'SCALE') pilot.status = 'COMPLETED';
      if (decisionVal === 'STOP') pilot.status = 'FAILED';
      // EXTEND leaves it in VALIDATION or returns to ACTIVE
    }
    
    addAudit(`Scale decision: ${decisionVal}`, pilot?.name || `Pilot ${pilotId}`, 'Arjun Patel', 'Government Officer');
    return true;
  }
};

export const summaryService = {
  getDashboardSummary: async () => {
    await delay();
    return {
      activeChallenges: challenges.length,
      applications: applications.length,
      pendingEvaluations: applications.filter(a => a.status === 'UNDER_EVALUATION').length,
      activePilots: pilots.filter(p => p.status === 'ACTIVE').length,
      pendingValidations: validations.filter(v => v.status === 'PENDING').length,
      pendingDecisions: decisions.filter(d => d.status === 'PENDING').length,
      recentActivity: [...activity].slice(0, 10)
    };
  }
};

export const notificationService = {
  getNotifications: async () => {
    await delay(300);
    return [...notifications];
  },
  markAsRead: async (id) => {
    const notif = notifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return true;
  }
};

export const auditService = {
  getAuditTrail: async () => {
    await delay(300);
    return [...auditTrail];
  }
};
