import { formatDateTime } from '@medplum/core';
import { Button, Document, useMedplum } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function CarePlansList(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const planDefinitions = medplum.searchResources('PlanDefinition').read();

  return (
    <Document>
      <h1>Care Plans</h1>
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
          {planDefinitions.map((planDefinition) => (
            <tr>
              <td>{planDefinition.title}</td>
              <td>{planDefinition.publisher}</td>
              <td>{formatDateTime(planDefinition.meta?.lastUpdated)}</td>
              <td>
                <Button size="small" primary={true} onClick={() => navigate(`/PlanDefinition/${planDefinition.id}`)}>
                  View
                </Button>
                <Button
                  size="small"
                  primary={true}
                  onClick={() => navigate(`/PlanDefinition/${planDefinition.id}/editor`)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  primary={true}
                  onClick={() => navigate(`/PlanDefinition/${planDefinition.id}/assign`)}
                >
                  Assign
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 50 }}>
        <Button primary={true}>New</Button>
        <Button primary={true}>Import</Button>
      </div>
    </Document>
  );
}
