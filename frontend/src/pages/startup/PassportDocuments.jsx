import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingState, Breadcrumb, Table, Badge } from '../../components/ui';
import { passportService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { Upload, FileText, CheckCircle, Clock } from 'lucide-react';

const PassportDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const passport = await passportService.getPassport(CURRENT_STARTUP_ID);
      setDocuments(passport.documents || []);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleUpload = () => {
    // Mock upload
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: `New Document ${documents.length + 1}.pdf`,
      type: 'Other',
      status: 'PENDING_VERIFICATION',
      uploadedDate: new Date().toISOString().split('T')[0]
    };
    setDocuments([...documents, newDoc]);
  };

  const handleRemove = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    await passportService.updatePassport(CURRENT_STARTUP_ID, { documents, documentsCompleted: documents.length > 0 });
    setSaving(false);
    navigate('/startup/passport');
  };

  if (loading) return <LoadingState />;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb items={[
        { label: 'Innovation Passport', href: '/startup/passport' },
        { label: 'Documents' }
      ]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>Documents</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Upload standard documents once, and reuse them across multiple applications.</p>
        </div>
        <Button onClick={handleUpload}><Upload size={16} style={{ marginRight: '0.5rem' }}/> Upload Document</Button>
      </div>

      <Card>
        {documents.length > 0 ? (
          <Table headers={['Document Name', 'Type', 'Uploaded Date', 'Verification Status', 'Actions']}>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                    <FileText size={16} color="var(--color-primary)" />
                    {doc.name}
                  </div>
                </td>
                <td>{doc.type}</td>
                <td>{doc.uploadedDate}</td>
                <td>
                  {doc.status === 'VERIFIED' ? (
                    <Badge color="green"><CheckCircle size={12}/> Verified</Badge>
                  ) : (
                    <Badge color="yellow"><Clock size={12}/> Pending Verification</Badge>
                  )}
                </td>
                <td>
                  <Button variant="outline" onClick={() => handleRemove(doc.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Remove</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No documents uploaded yet.
          </div>
        )}
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
        <Button variant="outline" onClick={() => navigate('/startup/passport')}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Documents'}</Button>
      </div>
    </div>
  );
};

export default PassportDocuments;
