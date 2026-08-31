import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, InputGroup, Input, LoadingState, Breadcrumb, Table, Modal, Textarea, StatusBadge, Select } from '../../components/ui';
import { pilotService } from '../../services/mockServices';
import { BarChart, Upload, Save, FileText } from 'lucide-react';

const EvidenceSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pilot, setPilot] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    kpiId: '',
    milestoneId: '',
    title: '',
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const p = await pilotService.getPilotById(id);
      setPilot(p);
      const evs = await pilotService.getEvidenceForPilot(id);
      setEvidenceList(evs);
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleSubmitEvidence = async () => {
    setLoading(true);
    await pilotService.submitEvidence({
      pilotId: id,
      kpiId: formData.kpiId,
      milestoneId: formData.milestoneId,
      title: formData.title,
      notes: formData.notes
    });
    const evs = await pilotService.getEvidenceForPilot(id);
    setEvidenceList(evs);
    setIsModalOpen(false);
    setFormData({ kpiId: '', milestoneId: '', title: '', notes: '' });
    setLoading(false);
  };

  if (loading && !pilot) return <LoadingState />;
  if (!pilot) return <div style={{ padding: '2rem' }}>Pilot not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Pilots', href: '/startup/pilots' },
        { label: pilot.name, href: `/startup/pilots/${id}` },
        { label: 'Evidence Library' }
      ]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart size={24} /> Evidence Library
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Upload supporting documentation for KPIs and Milestones.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Upload size={16} style={{ marginRight: '0.5rem' }}/> Upload Evidence
        </Button>
      </div>

      <Card>
        {evidenceList.length > 0 ? (
          <Table headers={['Evidence Title', 'Linked To', 'Date Submitted', 'Status']}>
            {evidenceList.map(ev => {
              let linkedTo = 'General';
              if (ev.kpiId) {
                const kpi = pilot.kpiResults.find(k => k.kpiId === ev.kpiId);
                linkedTo = kpi ? `KPI: ${kpi.name}` : 'KPI';
              } else if (ev.milestoneId) {
                const ms = pilot.milestones.find(m => m.id === ev.milestoneId);
                linkedTo = ms ? `Milestone: ${ms.name}` : 'Milestone';
              }
              
              return (
                <tr key={ev.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                      <FileText size={16} color="var(--color-primary)" />
                      {ev.title}
                    </div>
                  </td>
                  <td>{linkedTo}</td>
                  <td>{ev.date}</td>
                  <td><StatusBadge status={ev.status} /></td>
                </tr>
              );
            })}
          </Table>
        ) : (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>No Evidence Uploaded</h3>
            <p>Upload documents to support your KPI and Milestone claims.</p>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Evidence">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <InputGroup label="Evidence Title" id="title">
            <Input 
              id="title" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. Q1 Usage Report" 
            />
          </InputGroup>

          <InputGroup label="Link to KPI (Optional)" id="kpi">
            <Select id="kpi" value={formData.kpiId} onChange={e => setFormData({...formData, kpiId: e.target.value})}>
              <option value="">-- None --</option>
              {pilot.kpiResults.map(k => (
                <option key={k.kpiId} value={k.kpiId}>{k.name}</option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup label="Link to Milestone (Optional)" id="milestone">
            <Select id="milestone" value={formData.milestoneId} onChange={e => setFormData({...formData, milestoneId: e.target.value})}>
              <option value="">-- None --</option>
              {pilot.milestones.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup label="Notes / Link" id="notes">
            <Textarea 
              id="notes" 
              rows={4} 
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})} 
              placeholder="Provide a link or description of the evidence..." 
            />
          </InputGroup>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitEvidence} disabled={!formData.title}><Save size={16} style={{ marginRight: '0.5rem' }}/> Upload</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EvidenceSubmission;
