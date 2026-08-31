import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, InputGroup, LoadingState, Breadcrumb, Table, Badge, Modal, Textarea, Select } from '../../components/ui';
import { passportService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { Plus } from 'lucide-react';

const mockDeploymentsData = [
  { id: 'd-1', client: 'Ahmedabad Municipal Corporation', type: 'Government', domain: 'Waste Management', location: 'Ahmedabad', year: '2025', outcome: 'Reduced missed pickups by 15%.' },
  { id: 'd-2', client: 'Surat Smart City', type: 'Government', domain: 'Waste Management', location: 'Surat', year: '2024', outcome: 'Pilot successful, scaling to 3 zones.' },
  { id: 'd-3', client: 'CleanTech Logistics Pvt Ltd', type: 'Commercial', domain: 'Logistics', location: 'Mumbai', year: '2023', outcome: 'Improved fleet utilization by 22%.' }
];

const PassportDeployments = () => {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDep, setNewDep] = useState({ client: '', type: 'Government', domain: '', location: '', year: '', outcome: '' });

  useEffect(() => {
    // In a real app we'd fetch this from passportService
    setDeployments([...mockDeploymentsData]);
    setLoading(false);
  }, []);

  const handleAdd = () => {
    if (newDep.client && newDep.domain) {
      setDeployments([...deployments, { ...newDep, id: `d-new-${Date.now()}` }]);
      setIsModalOpen(false);
      setNewDep({ client: '', type: 'Government', domain: '', location: '', year: '', outcome: '' });
    }
  };

  const handleRemove = (id) => {
    setDeployments(deployments.filter(d => d.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    await passportService.updatePassport(CURRENT_STARTUP_ID, { deploymentsCompleted: deployments.length > 0 });
    setSaving(false);
    navigate('/startup/passport');
  };

  if (loading) return <LoadingState />;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Innovation Passport', href: '/startup/passport' },
        { label: 'Deployments' }
      ]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>Previous Deployments</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Showcase your track record to Government departments.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={16} style={{ marginRight: '0.5rem' }}/> Add Deployment</Button>
      </div>

      <Card>
        {deployments.length > 0 ? (
          <Table headers={['Client', 'Type', 'Domain / Location', 'Year', 'Outcome', 'Actions']}>
            {deployments.map(dep => (
              <tr key={dep.id}>
                <td style={{ fontWeight: 500 }}>{dep.client}</td>
                <td>
                  <Badge color={dep.type === 'Government' ? 'blue' : 'gray'}>{dep.type}</Badge>
                </td>
                <td>
                  <div>{dep.domain}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{dep.location}</div>
                </td>
                <td>{dep.year}</td>
                <td style={{ maxWidth: '250px' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dep.outcome}</div>
                </td>
                <td>
                  <Button variant="outline" onClick={() => handleRemove(dep.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Remove</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No deployments added yet.
          </div>
        )}
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
        <Button variant="outline" onClick={() => navigate('/startup/passport')}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Deployments'}</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Deployment">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <InputGroup label="Client Name" id="client">
            <Input id="client" value={newDep.client} onChange={e => setNewDep({...newDep, client: e.target.value})} />
          </InputGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputGroup label="Client Type" id="type">
              <Select id="type" value={newDep.type} onChange={e => setNewDep({...newDep, type: e.target.value})}>
                <option value="Government">Government / Public Sector</option>
                <option value="Commercial">Commercial / Private</option>
              </Select>
            </InputGroup>
            <InputGroup label="Year" id="year">
              <Input id="year" type="number" value={newDep.year} onChange={e => setNewDep({...newDep, year: e.target.value})} />
            </InputGroup>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputGroup label="Domain" id="domain">
              <Input id="domain" value={newDep.domain} onChange={e => setNewDep({...newDep, domain: e.target.value})} />
            </InputGroup>
            <InputGroup label="Location" id="location">
              <Input id="location" value={newDep.location} onChange={e => setNewDep({...newDep, location: e.target.value})} />
            </InputGroup>
          </div>
          <InputGroup label="Key Outcomes / Success Metrics" id="outcome">
            <Textarea id="outcome" rows={3} value={newDep.outcome} onChange={e => setNewDep({...newDep, outcome: e.target.value})} />
          </InputGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PassportDeployments;
