import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Textarea, InputGroup, Badge, Stepper, Modal, Select } from '../components/ui';
import { challengeService } from '../services/mockServices';
import { Plus, Trash2, Wand2 } from 'lucide-react';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiState, setAiState] = useState('idle'); // idle, loading, suggested
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saveAction, setSaveAction] = useState(null); // 'draft' or 'publish'
  
  const [formData, setFormData] = useState({
    title: '',
    department: 'Municipal Corporation',
    domain: '',
    location: '',
    problem: '',
    objective: '',
    expectedOutcome: '',
    scope: '',
    targetPopulation: '',
    budget: '',
    pilotBudget: '',
    applicationOpening: '',
    applicationDeadline: '',
    pilotDurationDays: 90,
    expectedPilotStart: '',
    kpis: [],
    eligibilityRules: [
      { id: 'er-1', name: 'Company Registration', required: true, documentRequired: true },
      { id: 'er-2', name: 'Conflict of Interest Declaration', required: true, documentRequired: true }
    ],
    evaluationCriteria: [
      { name: 'Problem-Solution Fit', weight: 30, description: 'How well the solution addresses the problem.' },
      { name: 'Technical Feasibility', weight: 30, description: 'Technical viability of the proposed solution.' },
      { name: 'Innovation', weight: 10, description: 'Novelty of the approach.' },
      { name: 'Cost Effectiveness', weight: 20, description: 'Value for money.' },
      { name: 'Pilot Readiness', weight: 10, description: 'Ability to deploy within the timeline.' }
    ]
  });

  const [aiSuggestions, setAiSuggestions] = useState(null);

  const steps = [
    'Problem',
    'Objective',
    'Budget & Timeline',
    'Success Criteria',
    'Eligibility',
    'Evaluation Criteria',
    'Review & Publish'
  ];

  // Validation
  const isStepValid = () => {
    switch(step) {
      case 0: return formData.title.trim() && formData.problem.trim() && formData.domain.trim();
      case 1: return formData.objective.trim() && formData.expectedOutcome.trim();
      case 2: 
        if (!formData.budget || formData.budget <= 0) return false;
        if (!formData.applicationOpening || !formData.applicationDeadline) return false;
        if (new Date(formData.applicationDeadline) <= new Date(formData.applicationOpening)) return false;
        return true;
      case 3:
        if (formData.kpis.length === 0) return false;
        return formData.kpis.every(k => k.name && k.unit && k.baseline !== '' && k.target !== '');
      case 4: return true; // Eligibility can be empty or have defaults
      case 5:
        const totalWeight = formData.evaluationCriteria.reduce((sum, c) => sum + Number(c.weight), 0);
        return totalWeight === 100 && formData.evaluationCriteria.every(c => c.name.trim());
      case 6: return true;
      default: return true;
    }
  };

  const handleAIStructure = async () => {
    setAiState('loading');
    const result = await challengeService.generateAIStructure(formData.problem);
    setAiSuggestions(result);
    setAiState('suggested');
  };

  const acceptAiSuggestions = () => {
    setFormData(prev => ({
      ...prev,
      objective: aiSuggestions.objective,
      expectedOutcome: aiSuggestions.expectedOutcome,
      pilotDurationDays: aiSuggestions.pilotDurationDays,
      kpis: [...prev.kpis, ...aiSuggestions.kpis]
    }));
    setAiState('idle');
    setAiSuggestions(null);
    setStep(1); // Move to next step
  };

  const discardAiSuggestions = () => {
    setAiState('idle');
    setAiSuggestions(null);
  };

  const handleSave = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      if (saveAction === 'draft') {
        await challengeService.saveDraft(formData);
      } else {
        await challengeService.createChallenge(formData);
      }
      navigate('/government/challenges');
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const totalEvalWeight = formData.evaluationCriteria.reduce((sum, c) => sum + Number(c.weight), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Challenge</h1>
          <p className="page-subtitle">Define an operational problem to match with startup solutions.</p>
        </div>
        <div>
          <Button variant="outline" onClick={() => { setSaveAction('draft'); handleSave(); }} disabled={loading}>
            Save Draft
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <Card style={{ alignSelf: 'start' }}>
          <Stepper steps={steps} currentStep={step} />
        </Card>

        <Card>
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>Step 1: Define the Problem</h3>
              <InputGroup label="Challenge Title" id="title">
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Waste Management Optimization" />
              </InputGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputGroup label="Domain" id="domain">
                  <Input value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} placeholder="e.g. Waste Management, Energy..." />
                </InputGroup>
                <InputGroup label="Location" id="location">
                  <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Ahmedabad" />
                </InputGroup>
              </div>
              <InputGroup label="Problem Description" id="problem">
                <Textarea rows={5} value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} placeholder="Describe the operational problem in your own words..." />
              </InputGroup>

              {aiState === 'suggested' && (
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(27, 44, 193, 0.05)', borderRadius: '0.5rem', border: '1px solid var(--color-primary)' }}>
                  <Badge color="blue" style={{ marginBottom: '1rem' }}><Wand2 size={12}/> AI-Generated Suggestion</Badge>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>We've analyzed the problem and suggested structured objectives, outcomes, and KPIs. You can review and edit them in the next steps.</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button onClick={acceptAiSuggestions}>Accept & Continue</Button>
                    <Button variant="secondary" onClick={handleAIStructure}>Regenerate</Button>
                    <Button variant="outline" onClick={discardAiSuggestions}>Discard</Button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                {aiState === 'idle' && (
                  <Button variant="secondary" onClick={handleAIStructure} disabled={!formData.problem}>
                    <Wand2 size={16}/> Structure with AI
                  </Button>
                )}
                {aiState === 'loading' && <Button variant="secondary" disabled>Analyzing problem...</Button>}
                <div style={{ flex: 1 }}></div>
                <Button onClick={() => setStep(1)} disabled={!isStepValid()}>Next</Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>Step 2: Objectives</h3>
              <InputGroup label="Objective" id="objective">
                <Textarea rows={3} value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} placeholder="What is the primary goal of this challenge?" />
              </InputGroup>
              <InputGroup label="Expected Outcome" id="expectedOutcome">
                <Textarea rows={3} value={formData.expectedOutcome} onChange={e => setFormData({...formData, expectedOutcome: e.target.value})} placeholder="What measurable impact are you expecting?" />
              </InputGroup>
              <InputGroup label="Scope (Optional)" id="scope">
                <Textarea rows={2} value={formData.scope} onChange={e => setFormData({...formData, scope: e.target.value})} placeholder="Any specific boundaries or constraints?" />
              </InputGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
                <div style={{ flex: 1 }}></div>
                <Button onClick={() => setStep(2)} disabled={!isStepValid()}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>Step 3: Budget & Timeline</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputGroup label="Total Estimated Budget (₹)" id="budget">
                  <Input type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                </InputGroup>
                <InputGroup label="Pilot Specific Budget (₹) (Optional)" id="pilotBudget">
                  <Input type="number" value={formData.pilotBudget} onChange={e => setFormData({...formData, pilotBudget: e.target.value})} />
                </InputGroup>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputGroup label="Application Opening Date" id="openingDate">
                  <Input type="date" value={formData.applicationOpening} onChange={e => setFormData({...formData, applicationOpening: e.target.value})} />
                </InputGroup>
                <InputGroup label="Application Deadline" id="deadline">
                  <Input type="date" value={formData.applicationDeadline} onChange={e => setFormData({...formData, applicationDeadline: e.target.value})} />
                </InputGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <InputGroup label="Pilot Duration (Days)" id="duration">
                  <Input type="number" value={formData.pilotDurationDays} onChange={e => setFormData({...formData, pilotDurationDays: e.target.value})} />
                </InputGroup>
                <InputGroup label="Expected Pilot Start Date (Optional)" id="startDate">
                  <Input type="date" value={formData.expectedPilotStart} onChange={e => setFormData({...formData, expectedPilotStart: e.target.value})} />
                </InputGroup>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <div style={{ flex: 1 }}></div>
                <Button onClick={() => setStep(3)} disabled={!isStepValid()}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>Step 4: Success Criteria (KPIs)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Define the metrics that will determine if the pilot is successful.</p>
              
              {formData.kpis.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FAFAFA', border: '1px dashed var(--color-border)', borderRadius: '0.5rem' }}>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No KPIs defined yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {formData.kpis.map((kpi, idx) => (
                    <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', position: 'relative' }}>
                      <button 
                        onClick={() => {
                          const newKpis = [...formData.kpis];
                          newKpis.splice(idx, 1);
                          setFormData({...formData, kpis: newKpis});
                        }}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <InputGroup label="KPI Name" id={`kpi-name-${idx}`}>
                          <Input value={kpi.name} onChange={e => {
                            const newKpis = [...formData.kpis];
                            newKpis[idx].name = e.target.value;
                            setFormData({...formData, kpis: newKpis});
                          }} />
                        </InputGroup>
                        <InputGroup label="Unit (e.g. %, hours)" id={`kpi-unit-${idx}`}>
                          <Input value={kpi.unit} onChange={e => {
                            const newKpis = [...formData.kpis];
                            newKpis[idx].unit = e.target.value;
                            setFormData({...formData, kpis: newKpis});
                          }} />
                        </InputGroup>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <InputGroup label="Baseline" id={`kpi-base-${idx}`}>
                          <Input type="number" value={kpi.baseline} onChange={e => {
                            const newKpis = [...formData.kpis];
                            newKpis[idx].baseline = e.target.value;
                            setFormData({...formData, kpis: newKpis});
                          }} />
                        </InputGroup>
                        <InputGroup label="Target" id={`kpi-target-${idx}`}>
                          <Input type="number" value={kpi.target} onChange={e => {
                            const newKpis = [...formData.kpis];
                            newKpis[idx].target = e.target.value;
                            setFormData({...formData, kpis: newKpis});
                          }} />
                        </InputGroup>
                        <InputGroup label="Is Higher Better?" id={`kpi-hb-${idx}`}>
                          <Select value={kpi.isHigherBetter ? 'true' : 'false'} onChange={e => {
                            const newKpis = [...formData.kpis];
                            newKpis[idx].isHigherBetter = e.target.value === 'true';
                            setFormData({...formData, kpis: newKpis});
                          }}>
                            <option value="true">Yes (e.g. Accuracy)</option>
                            <option value="false">No (e.g. Time, Cost)</option>
                          </Select>
                        </InputGroup>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button variant="outline" onClick={() => setFormData({...formData, kpis: [...formData.kpis, { name: '', baseline: '', target: '', unit: '', isHigherBetter: true }]})}>
                <Plus size={16} /> Add KPI
              </Button>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <div style={{ flex: 1 }}></div>
                <Button onClick={() => setStep(4)} disabled={!isStepValid()}>Next</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>Step 5: Eligibility Rules</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Configure mandatory requirements startups must meet before their application is evaluated.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formData.eligibilityRules.map((rule, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <Input value={rule.name} onChange={e => {
                        const rules = [...formData.eligibilityRules];
                        rules[idx].name = e.target.value;
                        setFormData({...formData, eligibilityRules: rules});
                      }} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <input type="checkbox" checked={rule.documentRequired} onChange={e => {
                        const rules = [...formData.eligibilityRules];
                        rules[idx].documentRequired = e.target.checked;
                        setFormData({...formData, eligibilityRules: rules});
                      }} />
                      Doc Req.
                    </label>
                    <button 
                        onClick={() => {
                          const rules = [...formData.eligibilityRules];
                          rules.splice(idx, 1);
                          setFormData({...formData, eligibilityRules: rules});
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" onClick={() => setFormData({...formData, eligibilityRules: [...formData.eligibilityRules, { name: 'New Rule', required: true, documentRequired: false }]})}>
                <Plus size={16} /> Add Rule
              </Button>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <div style={{ flex: 1 }}></div>
                <Button onClick={() => setStep(5)} disabled={!isStepValid()}>Next</Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>Step 6: Evaluation Criteria</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Define how experts will score applications. Total weights must equal 100%.</p>
              
              <div style={{ padding: '1rem', backgroundColor: totalEvalWeight === 100 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: totalEvalWeight === 100 ? 'var(--color-success)' : 'var(--color-error)', borderRadius: '0.5rem', fontWeight: 600 }}>
                Total Weight: {totalEvalWeight}%
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formData.evaluationCriteria.map((crit, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 2 }}>
                      <InputGroup label="Criteria Name" id={`crit-name-${idx}`}>
                        <Input value={crit.name} onChange={e => {
                          const crits = [...formData.evaluationCriteria];
                          crits[idx].name = e.target.value;
                          setFormData({...formData, evaluationCriteria: crits});
                        }} />
                      </InputGroup>
                    </div>
                    <div style={{ flex: 1 }}>
                      <InputGroup label="Weight (%)" id={`crit-weight-${idx}`}>
                        <Input type="number" value={crit.weight} onChange={e => {
                          const crits = [...formData.evaluationCriteria];
                          crits[idx].weight = e.target.value;
                          setFormData({...formData, evaluationCriteria: crits});
                        }} />
                      </InputGroup>
                    </div>
                    <div style={{ paddingTop: '1.75rem' }}>
                      <button 
                        onClick={() => {
                          const crits = [...formData.evaluationCriteria];
                          crits.splice(idx, 1);
                          setFormData({...formData, evaluationCriteria: crits});
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '0.5rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" onClick={() => setFormData({...formData, evaluationCriteria: [...formData.evaluationCriteria, { name: '', weight: 0, description: '' }]})}>
                <Plus size={16} /> Add Criteria
              </Button>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <Button variant="secondary" onClick={() => setStep(4)}>Back</Button>
                <div style={{ flex: 1 }}></div>
                <Button onClick={() => setStep(6)} disabled={!isStepValid()}>Next</Button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3>Step 7: Review & Publish</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.875rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#FAFAFA', borderRadius: '0.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Overview</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                    <strong style={{ color: 'var(--color-text-muted)' }}>Title:</strong> <span>{formData.title}</span>
                    <strong style={{ color: 'var(--color-text-muted)' }}>Domain:</strong> <span>{formData.domain}</span>
                    <strong style={{ color: 'var(--color-text-muted)' }}>Location:</strong> <span>{formData.location}</span>
                    <strong style={{ color: 'var(--color-text-muted)' }}>Budget:</strong> <span>₹{formData.budget}</span>
                    <strong style={{ color: 'var(--color-text-muted)' }}>Deadline:</strong> <span>{formData.applicationDeadline}</span>
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#FAFAFA', borderRadius: '0.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Problem & Objective</h4>
                  <p style={{ marginBottom: '1rem' }}><strong>Problem:</strong> {formData.problem}</p>
                  <p><strong>Objective:</strong> {formData.objective}</p>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#FAFAFA', borderRadius: '0.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>KPIs ({formData.kpis.length})</h4>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {formData.kpis.map((k, i) => <li key={i}>{k.name} (Target: {k.target} {k.unit})</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <Button variant="secondary" onClick={() => setStep(5)}>Back</Button>
                <div style={{ flex: 1 }}></div>
                <Button onClick={() => { setSaveAction('publish'); setShowConfirmModal(true); }}>
                  Publish Challenge
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Confirm Action">
        <div style={{ marginBottom: '1.5rem' }}>
          {saveAction === 'publish' ? (
            <p>Are you sure you want to publish <strong>{formData.title}</strong>? Once published, eligible startups will be able to discover and apply to this challenge.</p>
          ) : (
            <p>Save <strong>{formData.title}</strong> as a draft? You can return to edit and publish it later.</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Processing...' : 'Confirm'}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CreateChallenge;
