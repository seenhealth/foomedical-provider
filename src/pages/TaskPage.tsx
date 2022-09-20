import { Document, useMedplum } from '@medplum/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { TaskHeader } from './TaskHeader';

export function TaskPage(): JSX.Element {
  const { id } = useParams() as { id: string };
  const medplum = useMedplum();
  const tasks = medplum.searchResources('Task').read();
  const currIndex = tasks.findIndex((task) => task.id === id) ?? 0;
  const task = tasks[currIndex];

  return (
    <>
      {id && <TaskHeader taskId={id} />}
      <Document>
        <div>current task: {id}</div>
        <pre>{JSON.stringify(task, undefined, 2)}</pre>
      </Document>
    </>
  );
}
