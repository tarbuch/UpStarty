import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingState, StatusBadge, Table } from '../../components/ui';
import { pilotService, CURRENT_STARTUP_ID } from '../../services/mockServices';
import { PlaySquare } from 'lucide-react';

const PilotList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pilots, setPilots] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const pils = await pilotService.getStartupPilots(CURRENT_STARTUP_ID);
      setPilots(pils);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>My Pilots</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage ongoing pilots, submit evidence, and track KPIs.</p>
        </div>
      </div>

      <Card>
        {pilots.length > 0 ? (
          <Table headers={['Pilot Name', 'Government Dept', 'Start Date', 'End Date', 'Status', 'Actions']}>
            {pilots.map(pilot => (
              <tr key={pilot.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{pilot.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ID: {pilot.id}</div>
                </td>
                <td>{pilot.department}</td>
                <td>{pilot.startDate}</td>
                <td>{pilot.endDate}</td>
                <td>
                  <StatusBadge status={pilot.status} />
                </td>
                <td>
                  <Button variant="outline" onClick={() => navigate(`/startup/pilots/${pilot.id}`)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Manage Pilot</Button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <PlaySquare size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>No Active Pilots</h3>
            <p style={{ marginBottom: '1.5rem' }}>You don't have any ongoing pilots right now.</p>
            <Button onClick={() => navigate('/startup/applications')}>View Applications</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PilotList;
