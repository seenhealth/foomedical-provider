import { formatGivenName } from '@medplum/core';
import { HumanName, Patient, Practitioner, Reference, Task } from '@medplum/fhirtypes';
import { Button, Document, ResourceBadge, StatusBadge, useMedplum, useMedplumProfile } from '@medplum/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReassignDialog } from './ReassignDialog';

import './HomePage.css';
import { getTaskActions, getTaskType } from './utils';

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const [reassignTask, setReassignTask] = useState<Task>();

  const tasks = medplum
    .searchResources('Task')
    .read()
    .filter((task) => task.for?.reference?.startsWith('Patient/'))
    .sort((a, b) => {
      // Sort tasks by:
      // 1) Patient
      // 2) Priority
      const aPatient = a.for?.reference || '';
      const bPatient = b.for?.reference || '';
      if (aPatient !== bPatient) {
        return aPatient < bPatient ? -1 : 1;
      }
      const aPriority = a.priority || '';
      const bPriority = b.priority || '';
      if (aPriority !== bPriority) {
        return aPriority < bPriority ? -1 : 1;
      }
      return 0;
    });

  return (
    <>
      <Document width={1200}>
        <h1>Welcome {formatGivenName(profile.name?.[0] as HumanName)}</h1>
        <table className="foo-table">
          <tbody>
            {tasks.map((task, taskIndex) => (
              <tr key={task.id}>
                <td>
                  {(taskIndex === 0 || task.for?.reference !== tasks[taskIndex - 1].for?.reference) && (
                    <ResourceBadge value={task.for as Reference<Patient>} />
                  )}
                </td>
                <td>{getTaskType(task)}</td>
                <td>{task.description}</td>
                <td>
                  <StatusBadge status={task.status as string} />
                  {task.priority && <StatusBadge status={task.priority as string} />}
                </td>
                <td>
                  {getTaskActions(task).map((action, actionIndex) => (
                    <Button
                      key={`action-${actionIndex}`}
                      size="small"
                      primary={action.primary}
                      onClick={() => navigate(action.href)}
                    >
                      {action.label}
                    </Button>
                  ))}
                  <Button size="small" onClick={() => setReassignTask(task)}>
                    Reassign
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Document>
      <ReassignDialog
        task={reassignTask}
        onOk={() => setReassignTask(undefined)}
        onCancel={() => setReassignTask(undefined)}
      />
    </>
  );
}
