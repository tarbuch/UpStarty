import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import ChallengeList from './pages/ChallengeList';
import CreateChallenge from './pages/CreateChallenge';
import ChallengeDetail from './pages/ChallengeDetail';
import StartupDiscovery from './pages/StartupDiscovery';
import StartupDetail from './pages/StartupDetail';
import StartupMatching from './pages/StartupMatching';
import ApplicationList from './pages/ApplicationList';
import ApplicationDetail from './pages/ApplicationDetail';
import EvaluationOverview from './pages/EvaluationOverview';
import PilotList from './pages/PilotList';
import PilotDashboard from './pages/PilotDashboard';
import ValidationOverview from './pages/ValidationOverview';
import ScaleDecision from './pages/ScaleDecision';
import EvidenceLibrary from './pages/EvidenceLibrary';
import AuditTrail from './pages/AuditTrail';
import Settings from './pages/Settings';
import { EmptyState } from './components/ui';

import { StartupAppShell } from './components/layout/StartupAppShell';
import StartupDashboardView from './pages/startup/Dashboard';
import StartupChallengeDiscovery from './pages/startup/ChallengeDiscovery';
import StartupChallengeDetail from './pages/startup/ChallengeDetail';
import StartupEligibilityCheck from './pages/startup/EligibilityCheck';
import StartupMatchAnalysis from './pages/startup/MatchAnalysis';
import StartupApplicationWizard from './pages/startup/ApplicationWizard';
import StartupApplicationList from './pages/startup/ApplicationList';
import StartupApplicationDetail from './pages/startup/ApplicationDetail';
import StartupPilotList from './pages/startup/PilotList';
import StartupPilotDashboard from './pages/startup/PilotDashboard';
import StartupKPIManagement from './pages/startup/KPIManagement';
import StartupMilestoneManagement from './pages/startup/MilestoneManagement';
import StartupEvidenceSubmission from './pages/startup/EvidenceSubmission';
import StartupPassportDashboard from './pages/startup/PassportDashboard';
import StartupPassportProfile from './pages/startup/PassportProfile';
import StartupPassportCapabilities from './pages/startup/PassportCapabilities';
import StartupPassportTechnologies from './pages/startup/PassportTechnologies';
import StartupPassportDeployments from './pages/startup/PassportDeployments';
import StartupPassportCertifications from './pages/startup/PassportCertifications';
import StartupPassportDocuments from './pages/startup/PassportDocuments';


const NotFound = () => (
  <div style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center' }}>
    <EmptyState title="Page Not Found" description="The page you are looking for does not exist or has been moved." />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/government" replace />} />
        
        <Route path="/government" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          
          <Route path="challenges" element={<ChallengeList />} />
          <Route path="challenges/new" element={<CreateChallenge />} />
          <Route path="challenges/:id" element={<ChallengeDetail />} />
          <Route path="challenges/:id/match" element={<StartupMatching />} />
          
          <Route path="startups" element={<StartupDiscovery />} />
          <Route path="startups/:id" element={<StartupDetail />} />
          
          <Route path="applications" element={<ApplicationList />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          
          <Route path="evaluations" element={<EvaluationOverview />} />
          
          <Route path="pilots" element={<PilotList />} />
          <Route path="pilots/:id" element={<PilotDashboard />} />
          
          <Route path="validations" element={<ValidationOverview />} />
          <Route path="decisions" element={<ScaleDecision />} />
          <Route path="evidence" element={<EvidenceLibrary />} />
          <Route path="audit" element={<AuditTrail />} />
          
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/startup" element={<StartupAppShell />}>
          <Route index element={<StartupDashboardView />} />
          
          <Route path="challenges" element={<StartupChallengeDiscovery />} />
          <Route path="challenges/:id" element={<StartupChallengeDetail />} />
          <Route path="challenges/:id/eligibility" element={<StartupEligibilityCheck />} />
          <Route path="challenges/:id/match" element={<StartupMatchAnalysis />} />
          
          <Route path="applications" element={<StartupApplicationList />} />
          <Route path="applications/new/:challengeId" element={<StartupApplicationWizard />} />
          <Route path="applications/:id" element={<StartupApplicationDetail />} />
          
          <Route path="pilots" element={<StartupPilotList />} />
          <Route path="pilots/:id" element={<StartupPilotDashboard />} />
          <Route path="pilots/:id/kpis" element={<StartupKPIManagement />} />
          <Route path="pilots/:id/milestones" element={<StartupMilestoneManagement />} />
          <Route path="pilots/:id/evidence" element={<StartupEvidenceSubmission />} />
          
          <Route path="passport" element={<StartupPassportDashboard />} />
          <Route path="passport/profile" element={<StartupPassportProfile />} />
          <Route path="passport/capabilities" element={<StartupPassportCapabilities />} />
          <Route path="passport/technologies" element={<StartupPassportTechnologies />} />
          <Route path="passport/deployments" element={<StartupPassportDeployments />} />
          <Route path="passport/certifications" element={<StartupPassportCertifications />} />
          <Route path="passport/documents" element={<StartupPassportDocuments />} />
          
          {/* Using EmptyState directly for these for now, can be replaced by real components later if needed */}
          <Route path="notifications" element={<div style={{ padding: '2rem' }}><EmptyState title="Notifications" description="No new notifications" /></div>} />
          <Route path="profile" element={<div style={{ padding: '2rem' }}><EmptyState title="Profile" description="Startup profile details" /></div>} />
          <Route path="settings" element={<div style={{ padding: '2rem' }}><EmptyState title="Settings" description="Startup settings" /></div>} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
