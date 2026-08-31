const fs = require('fs');
const path = require('path');

const pages = [
  'Dashboard',
  'ChallengeDiscovery',
  'ChallengeDetail',
  'EligibilityCheck',
  'MatchAnalysis',
  'ApplicationWizard',
  'ApplicationList',
  'ApplicationDetail',
  'PilotList',
  'PilotDashboard',
  'KPIManagement',
  'MilestoneManagement',
  'EvidenceSubmission',
  'PassportDashboard',
  'PassportProfile',
  'PassportCapabilities',
  'PassportTechnologies',
  'PassportDeployments',
  'PassportCertifications',
  'PassportDocuments'
];

const dir = path.join(__dirname, 'src', 'pages', 'startup');

pages.forEach(page => {
  const content = `import React from 'react';
import { EmptyState } from '../../components/ui';

const ${page} = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <EmptyState title="${page}" description="This page is under construction." />
    </div>
  );
};

export default ${page};
`;
  fs.writeFileSync(path.join(dir, `${page}.jsx`), content);
});

console.log('Created placeholder components.');
