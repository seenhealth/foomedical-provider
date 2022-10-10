import { Document, useMedplum } from '@medplum/react';
import React from 'react';
import { Link } from 'react-router-dom';

export function ReportsPage(): JSX.Element {
  const medplum = useMedplum();
  const patients = medplum.search('Patient', '_summary=count').read();
  const hypertensivePatients = medplum
    .search('Condition', 'clinical-status:contains=active&code=59621000&_summary=count')
    .read();
  const normalPregnancy = medplum
    .search('Condition', 'clinical-status:contains=active&code=72892002&_summary=count')
    .read();

  return (
    <Document>
      <h1>Patients</h1>
      <table className="foo-table">
        <thead>
          <tr>
            <th>Condition (SNOMED Code)</th>
            <th>Affected</th>
            <th>Total Patients</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hypertensive patients (59621000)</td>
            <td>
              <Link to="/Condition?code=59621000">{hypertensivePatients.total}</Link>
            </td>
            <td>{patients.total}</td>
          </tr>
          <tr>
            <td>Normal pregnancy (72892002)</td>
            <td>
              <Link to="/Condition?code=72892002">{normalPregnancy.total}</Link>
            </td>
            <td>{patients.total}</td>
          </tr>
        </tbody>
      </table>
    </Document>
  );
}
