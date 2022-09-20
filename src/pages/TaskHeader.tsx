import { MedplumLink, useMedplum } from '@medplum/react';
import React from 'react';
import { getTaskHref } from './utils';

import './TaskHeader.css';

export interface TaskHeaderProps {
  taskId: string;
}

export function TaskHeader(props: TaskHeaderProps): JSX.Element | null {
  const medplum = useMedplum();
  const tasks = medplum.searchResources('Task', '_sort=for').read();
  const taskId = props.taskId;
  const currIndex = taskId ? tasks.findIndex((task) => task.id === taskId) : -1;
  if (currIndex === -1) {
    return null;
  }

  const task = tasks[currIndex];
  const prevTask = currIndex > 0 ? tasks[currIndex - 1] : undefined;
  const nextTask = currIndex < tasks.length - 1 ? tasks[currIndex + 1] : undefined;

  return (
    <div className="task-header-container">
      <div className="task-header">
        <div style={{ width: 200 }}>
          {prevTask && <MedplumLink to={getTaskHref(prevTask)}>&lt; Previous</MedplumLink>}
        </div>
        <div style={{ flex: 1 }}>
          Task: {task.description} ({currIndex + 1} / {tasks.length})
        </div>
        <div style={{ width: 200 }}>{nextTask && <MedplumLink to={getTaskHref(nextTask)}>Next &gt;</MedplumLink>}</div>
      </div>
    </div>
  );
}
