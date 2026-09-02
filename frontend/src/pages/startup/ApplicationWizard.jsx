import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, InputGroup, Textarea, LoadingState, Breadcrumb, Stepper } from '../../components/ui';
import { challengeService, applicationService, passportService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { Save, Send } from 'lucide-react';

const ApplicationWizard = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    profile: {},
    solution: '',
    architecture: '',
    timeline: '',
    budget: '',
    team: ''
  });

  useEffect(() => {
    const loadData = async () => {
      // Fetch challenge
      const ch = await challengeService.getChallengeById(challengeId);
      setChallenge(ch);

      const passport = await passportService.getPassport(CURRENT_STARTUP_ID);
      
      // Look for an existing application (e.g. DRAFT)
      const apps = await applicationService.getStartupApplications(CURRENT_STARTUP_ID);
      const existingApp = apps.find(a => a.challengeId === challengeId);
      
      if (existingApp && existingApp.data) {
        setFormData(existingApp.data);
      } else {
        setFormData(prev => ({
          ...prev,
          profile: {
            name: 'EcoRoute AI', // Default for mock, could pull from actual startup
            description: passport?.capabilitiesCompleted ? 'AI-powered routing' : '',
          }
        }));
      }

      setLoading(false);
    };
    loadData();
  }, [challengeId]);

  const handleSaveDraft = async () => {
    setSaving(true);
    await applicationService.submitApplication({
      challengeId,
      startupId: CURRENT_STARTUP_ID,
      data: formData
    }, true);
    setSaving(false);
    navigate('/startup/applications');
  };

  const handleSubmit = async () => {
    setSaving(true);
    await applicationService.submitApplication({
      challengeId,
      startupId: CURRENT_STARTUP_ID,
      data: formData
    }, false);
    setSaving(false);
    navigate('/startup/applications');
  };

  if (loading) return <LoadingState />;
  if (!challenge) return <div style={{ padding: '2rem' }}>Challenge not found.</div>;

  const steps = ['Passport Data', 'Solution Proposal', 'Implementation', 'Review'];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Challenges', href: '/startup/challenges' },
        { label: challenge.title, href: `/startup/challenges/${challengeId}` },
        { label: 'Application Wizard' }
      ]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Submit Application</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{challenge.title}</p>
        </div>
        <Button variant="outline" onClick={handleSaveDraft} disabled={saving}><Save size={16} style={{ marginRight: '0.5rem' }}/> Save Draft</Button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Stepper steps={steps} currentStep={step} />
      </div>

      <Card style={{ padding: '2rem' }}>
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Data from Innovation Passport</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>The following information is automatically pulled from your passport. To edit this, you must update your passport.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Startup Name</div>
                <div style={{ fontWeight: 500, marginBottom: '1rem' }}>{formData.profile.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Capabilities</div>
                <div style={{ fontWeight: 500, marginBottom: '1rem' }}>{formData.profile.description}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <Button onClick={() => setStep(1)}>Next: Solution</Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Solution Proposal</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <InputGroup label="Describe your solution" id="solution">
                <Textarea id="solution" rows={6} value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} placeholder="How does your solution address the problem statement?" />
              </InputGroup>
              <InputGroup label="Technical Architecture" id="architecture">
                <Textarea id="architecture" rows={4} value={formData.architecture} onChange={e => setFormData({...formData, architecture: e.target.value})} placeholder="Briefly describe the technology stack and architecture." />
              </InputGroup>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Next: Implementation</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Implementation Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <InputGroup label="Proposed Timeline (Months)" id="timeline">
                <Input id="timeline" type="number" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})} />
              </InputGroup>
              <InputGroup label="Estimated Budget Required (₹)" id="budget">
                <Input id="budget" type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
              </InputGroup>
              <InputGroup label="Key Team Members" id="team">
                <Textarea id="team" rows={3} value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})} placeholder="List key personnel and their roles for this pilot." />
              </InputGroup>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next: Review</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Review Application</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Please review your application before submitting. Once submitted, it will be evaluated by the Government department.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--color-background-alt)', padding: '1.5rem', borderRadius: '8px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Solution Proposal</h4>
                <p>{formData.solution || <span style={{ color: 'var(--color-error)' }}>Missing</span>}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Timeline</h4>
                <p>{formData.timeline ? `${formData.timeline} Months` : <span style={{ color: 'var(--color-error)' }}>Missing</span>}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Budget</h4>
                <p>{formData.budget ? `₹${formData.budget}` : <span style={{ color: 'var(--color-error)' }}>Missing</span>}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleSubmit} disabled={saving}><Send size={16} style={{ marginRight: '0.5rem' }}/> {saving ? 'Submitting...' : 'Submit Application'}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicationWizard;
