import { Button } from '@mantine/core';
import { formatDateTime } from '@medplum/core';
import { Document, useMedplum } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function FormsList(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const forms = medplum.searchResources('Questionnaire', 'context=patient-form').read();

  return (
    <Document>
      <h1>Forms</h1>
      <table className="foo-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Publisher</th>
            <th>Last Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              <td>{form.title}</td>
              <td>{form.publisher}</td>
              <td>{formatDateTime(form.meta?.lastUpdated)}</td>
              <td>
                <Button size="sm" onClick={() => navigate(`/Questionnaire/${form.id}`)}>
                  View
                </Button>
                <Button size="sm" onClick={() => navigate(`/Questionnaire/${form.id}/editor`)}>
                  Edit
                </Button>
                <Button size="sm" onClick={() => navigate(`/Questionnaire/${form.id}/assign`)}>
                  Assign
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
