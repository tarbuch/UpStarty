import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, LoadingState, Breadcrumb, Table, Modal, Textarea, Badge } from '../../components/ui';
import { pilotService } from '../../services/mockServices';
import { CheckSquare, Upload, Save, CheckCircle } from 'lucide-react';

const MilestoneManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pilot, setPilot] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [deliverableNotes, setDeliverableNotes] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const p = await pilotService.getPilotById(id);
      setPilot(p);
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleOpenModal = (m) => {
    setActiveMilestone(m);
    setDeliverableNotes('');
    setIsModalOpen(true);
  };

  const handleSubmitDeliverable = async () => {
    setLoading(true);
    await pilotService.submitMilestoneDeliverable(id, activeMilestone.id, {
      notes: deliverableNotes
    });
    const p = await pilotService.getPilotById(id);
    setPilot(p);
    setIsModalOpen(false);
    setLoading(false);
  };

  if (loading && !pilot) return <LoadingState />;
  if (!pilot) return <div style={{ padding: '2rem' }}>Pilot not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Pilots', href: '/startup/pilots' },
        { label: pilot.name, href: `/startup/pilots/${id}` },
        { label: 'Milestones & Payments' }
      ]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={24} /> Milestones & Payments
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Submit deliverables to trigger Government verification and payment release.</p>
        </div>
      </div>

      <Card>
        <Table headers={['Milestone', 'Due Date', 'Payment Amount', 'Milestone Status', 'Payment Status', 'Action']}>
          {pilot.milestones.map((m) => (
            <tr key={m.id}>
              <td style={{ fontWeight: 500 }}>{m.name}</td>
              <td>{m.date}</td>
              <td style={{ fontWeight: 500, color: 'var(--color-primary)' }}>₹{(m.amount / 100000).toFixed(1)}L</td>
              <td>
                <StatusBadge status={m.status} />
              </td>
              <td>
                {m.paymentStatus === 'RELEASED' ? (
                  <Badge color="green"><CheckCircle size={12} style={{ marginRight: '4px' }}/> Released</Badge>
                ) : (
                  <Badge color="gray">Pending Verification</Badge>
                )}
              </td>
              <td>
                {m.status === 'PENDING' ? (
                  <Button 
                    onClick={() => handleOpenModal(m)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    <Upload size={14} style={{ marginRight: '0.5rem' }}/> Submit Deliverable
                  </Button>
                ) : m.status === 'PENDING_VERIFICATION' ? (
                  <Button 
                    variant="outline" 
                    disabled
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    Under Review
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    disabled
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    Verified
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Milestone Deliverable">
        {activeMilestone && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-background-alt)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{activeMilestone.name}</div>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                <span>Due Date: {activeMilestone.date}</span>
                <span>Payment Amount: ₹{(activeMilestone.amount / 100000).toFixed(1)}L</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Deliverable Details & Links</label>
              <Textarea 
                rows={5} 
                value={deliverableNotes}
                onChange={(e) => setDeliverableNotes(e.target.value)}
                placeholder="Provide links to reports, code repositories, or describe the completion of this milestone..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitDeliverable}><Save size={16} style={{ marginRight: '0.5rem' }}/> Submit for Verification</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MilestoneManagement;
