import { Button } from '@mantine/core';
import { Document, ResourceBadge, useMedplum } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PatientsList(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const patients = medplum.searchResources('Patient').read();

  return (
    <Document>
      <h1>Patients</h1>
      <table className="foo-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>DoB</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>
                <ResourceBadge value={patient} />
              </td>
              <td>{patient.birthDate}</td>
              <td>{patient.telecom?.find((cp) => cp.system === 'email')?.value}</td>
              <td>
                <Button size="sm" onClick={() => navigate(`/Patient/${patient.id}`)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 50 }}>
        <Button>New</Button>
        <Button>Import</Button>
      </div>
    </Document>
  );
}
