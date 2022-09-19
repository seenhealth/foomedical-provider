import { Practitioner } from '@medplum/fhirtypes';
import { Document, MedplumLink, useMedplum, useMedplumProfile } from '@medplum/react';
import React from 'react';
import { useParams } from 'react-router-dom';

export function TaskPage(): JSX.Element {
  const { id, tab } = useParams() as {
    id: string;
    tab: string;
  };
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const tasks = medplum.searchResources('Task').read();
  const currIndex = tasks.findIndex((task) => task.id === id) ?? 0;
  const task = tasks[currIndex];
  const previous = currIndex > 0 ? tasks[currIndex - 1] : undefined;
  const next = currIndex < tasks.length - 1 ? tasks[currIndex + 1] : undefined;

  return (
    <>
      <div
        style={{
          display: 'flex',
          background: '#cce5ff',
          border: '1px solid #b8daff',
          borderRadius: 8,
          margin: 8,
          padding: 8,
          textAlign: 'center',
        }}
      >
        <div style={{ width: 200 }}>{previous && <MedplumLink to={previous}>&lt; Previous</MedplumLink>}</div>
        <div style={{ flex: 1 }}>
          Task {currIndex + 1} / {tasks.length}
        </div>
        <div style={{ width: 200 }}>{next && <MedplumLink to={next}>Next &gt;</MedplumLink>}</div>
      </div>
      <Document>
        <div>current task: {id}</div>
        <pre>{JSON.stringify(task, undefined, 2)}</pre>
      </Document>
    </>
  );
}
