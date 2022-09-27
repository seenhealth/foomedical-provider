import { Button, Document, MedplumLink, ResourceBadge, useMedplum } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ReportsPage(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const patients = medplum.search('Patient', '_summary=count').read();
  console.log(patients.total);
  const diabeticPatients = medplum.search('Condition', 'clinical-status:contains=active&code=359642000').read();
  //console.log('2');
  const normalPregnancy = medplum.search('Condition', 'clinical-status:contains=active&code=72892002').read();
  //console.log('3');

  return (
    <Document>
      <h1>Patients</h1>
      <table className="foo-table">
        <thead>
          <tr>
            <th>Condition (SNOMED Code)</th>
            <th>Affected</th>
            <th>Total Patients</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Diabetes mellitus type 2 in nonobese (359642000)</td>
            <td>{diabeticPatients.total}</td>
            <td>{patients.total}</td>
          </tr>
          <tr>
            <td>Normal pregnancy (72892002)</td>
            <td>{normalPregnancy.total}</td>
            <td>{patients.total}</td>
          </tr>
        </tbody>
      </table>
    </Document>
  );
}
