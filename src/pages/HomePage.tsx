import { formatGivenName, getReferenceString } from '@medplum/core';
import { HumanName, Patient, Practitioner } from '@medplum/fhirtypes';
import { Avatar, Button, Document, HumanNameDisplay, useMedplum, useMedplumProfile } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import './HomePage.css';

const patients: Patient[] = [
  {
    resourceType: 'Patient',
    name: [{ given: ['Tom'], family: 'Smith' }],
    photo: [{ url: '/people/pexels-photo-220453-300.jpg' }],
  },
  {
    resourceType: 'Patient',
    name: [{ given: ['Alice'], family: 'Li' }],
    photo: [{ url: '/people/pexels-photo-415829-300.jpg' }],
  },
  {
    resourceType: 'Patient',
    name: [{ given: ['Karen'], family: 'Washington' }],
    photo: [{ url: '/people/pexels-photo-5491144-300.jpg' }],
  },
  {
    resourceType: 'Patient',
    name: [{ given: ['Tom'], family: 'Smith' }],
    photo: [{ url: '/people/pexels-photo-7275385-300.jpg' }],
  },
];

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const tasks = medplum.searchResources('Task').read();

  return (
    <>
      <Document>
        <h1>Welcome {formatGivenName(profile.name?.[0] as HumanName)}</h1>
      </Document>
      {tasks?.map((task, index) => (
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
              <Avatar src={patients[index % 4].photo?.[0]?.url} size="large" color="#f80" />
              <HumanNameDisplay value={patients[index % 4].name?.[0] as HumanName} />
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
