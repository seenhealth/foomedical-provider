import { formatGivenName, getReferenceString } from '@medplum/core';
import { HumanName, Practitioner } from '@medplum/fhirtypes';
import { Avatar, Button, Document, useMedplum, useMedplumProfile } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const tasks = medplum.searchResources('Task', 'owner=' + getReferenceString(profile)).read();

  return (
    <>
      <Document>
        <h1>Welcome {formatGivenName(profile.name?.[0] as HumanName)}</h1>
      </Document>
      {tasks?.map((task) => (
        <Document key={task.id}>
          <div className="task-details" style={{ display: 'flex', flexDirection: 'row' }}>
            <div
              className="task-patient-details"
              style={{
                width: 120,
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
              }}
            >
              <Avatar alt="A B C" size="large" color="#f80" />
              Patient
            </div>
            <div style={{ flex: 1 }}>
              <pre style={{ fontSize: 9 }}>{JSON.stringify(task, null, 2)}</pre>
              <hr />
              <div className="task-actions">
                <Button primary={true} onClick={() => navigate(`/Task/${task.id}`)}>
                  Review
                </Button>
                <Button primary={true}>Schedule</Button>
                <Button primary={true}>Reassign</Button>
              </div>
            </div>
          </div>
        </Document>
      ))}
    </>
  );
}
