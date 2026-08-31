import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, InputGroup, LoadingState, Breadcrumb, Table, Modal } from '../../components/ui';
import { passportService, CURRENT_STARTUP_ID, startupService } from '../../services/mockServices';
import { Plus } from 'lucide-react';

const PassportCertifications = () => {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', authority: '', date: '', expiry: '' });

  useEffect(() => {
    const loadData = async () => {
      const startup = await startupService.getStartupById(CURRENT_STARTUP_ID);
      // Map strings to objects if necessary, or just mock some
      const certs = (startup.certifications || []).map((c, i) => ({
        id: `c-${i}`,
        name: c,
        authority: 'Standard Body',
        date: '2024-01-01',
        expiry: '2027-01-01'
      }));
      setCertifications(certs);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAdd = () => {
    if (newCert.name && newCert.authority) {
      setCertifications([...certifications, { ...newCert, id: `c-new-${Date.now()}` }]);
      setIsModalOpen(false);
      setNewCert({ name: '', authority: '', date: '', expiry: '' });
    }
  };

  const handleRemove = (id) => {
    setCertifications(certifications.filter(c => c.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    await passportService.updatePassport(CURRENT_STARTUP_ID, { certificationsCompleted: certifications.length > 0 });
    setSaving(false);
    navigate('/startup/passport');
  };

  if (loading) return <LoadingState />;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Innovation Passport', href: '/startup/passport' },
        { label: 'Certifications' }
      ]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>Certifications</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Important for passing eligibility requirements on Government challenges.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={16} style={{ marginRight: '0.5rem' }}/> Add Certification</Button>
      </div>

      <Card>
        {certifications.length > 0 ? (
          <Table headers={['Certification Name', 'Issuing Authority', 'Issue Date', 'Expiry Date', 'Actions']}>
            {certifications.map(cert => (
              <tr key={cert.id}>
                <td style={{ fontWeight: 500 }}>{cert.name}</td>
                <td>{cert.authority}</td>
                <td>{cert.date}</td>
                <td>{cert.expiry || 'N/A'}</td>
                <td>
                  <Button variant="outline" onClick={() => handleRemove(cert.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Remove</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No certifications added yet.
          </div>
        )}
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
        <Button variant="outline" onClick={() => navigate('/startup/passport')}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Certifications'}</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Certification">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <InputGroup label="Certification Name" id="name">
            <Input id="name" placeholder="e.g. ISO 27001" value={newCert.name} onChange={e => setNewCert({...newCert, name: e.target.value})} />
          </InputGroup>
          <InputGroup label="Issuing Authority" id="authority">
            <Input id="authority" value={newCert.authority} onChange={e => setNewCert({...newCert, authority: e.target.value})} />
          </InputGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputGroup label="Issue Date" id="date">
              <Input id="date" type="date" value={newCert.date} onChange={e => setNewCert({...newCert, date: e.target.value})} />
            </InputGroup>
            <InputGroup label="Expiry Date (Optional)" id="expiry">
              <Input id="expiry" type="date" value={newCert.expiry} onChange={e => setNewCert({...newCert, expiry: e.target.value})} />
            </InputGroup>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PassportCertifications;
