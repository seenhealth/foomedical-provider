import { formatGivenName } from '@medplum/core';
import { HumanName, Patient, Practitioner, Reference, Task } from '@medplum/fhirtypes';
import { Button, Document, ResourceBadge, StatusBadge, useMedplum, useMedplumProfile } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import './HomePage.css';

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const tasks = medplum.searchResources('Task').read();

  return (
    <Document width={1200}>
      <h1>Welcome {formatGivenName(profile.name?.[0] as HumanName)}</h1>
      <table className="foo-table">
        <tbody>
          {tasks.map((task) => (
            <tr>
              <td>
                <ResourceBadge value={task.for as Reference<Patient>} />
              </td>
              <td>{getTaskType(task)}</td>
              <td>{task.description}</td>
              <td>
                <StatusBadge status={task.status as string} />
                {task.priority && <StatusBadge status={task.priority as string} />}
              </td>
              <td>
                {getTaskActions(task).map((action) => (
                  <Button size="small" primary={action.primary} onClick={() => navigate(action.href)}>
                    {action.label}
                  </Button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Document>
  );
}

/*

| Task                                  | Actions                                  | Data Model                          |
| ------------------------------------- | ---------------------------------------- | ----------------------------------- |
| Schedule a Patient Visit              | Schedule, Reassign                       | Task.focus -> Appointment           |
| Request Completion of a Questionnaire | Send to Patient, Send Reminder, Reassign | Task.focus -> Questionnaire         |
| Order Lab                             | Order                                    | Task.focus -> ServiceRequest        |
|                                       |                                          | ServiceRequest.code.system = LOINC  |
| Review Lab                            | Review Report, Reassign                  | Task.focus -> DiagnosticReport.     |
| Order Imaging Study Order, Review,    | Reassign                                 | Task.focus -> ServiceRequestRequest |
|                                       |                                          | ServiceRequest.code.sysetm = SNOMED |
| Review Imaging                        | Review                                   | Task.focus -> Imaging Study         |

*/

function getTaskType(task: Task): string {
  const ref = task.focus?.reference;
  if (ref) {
    if (ref.startsWith('Appointment')) {
      return 'Schedule a Patient Visit';
    }
    if (ref.startsWith('Questionnaire')) {
      return 'Request Completion of a Questionnaire';
    }
    if (ref.startsWith('ServiceRequest')) {
      return 'Order Lab';
    }
    if (ref.startsWith('DiagnosticReport')) {
      return 'Review Lab';
    }
    if (ref.startsWith('ImagingStudy')) {
      return 'Review Imaging';
    }
  }
  return 'Task';
}

function getTaskActions(task: Task): { label: string; href: string; primary?: boolean }[] {
  switch (getTaskType(task)) {
    case 'Schedule a Patient Visit':
      return [
        { label: 'Schedule', href: `/Task/${task.id}` },
        { label: 'Reassign', href: `/Task/${task.id}` },
      ];
    case 'Request Completion of a Questionnaire':
      return [
        { label: 'Send to Patient', href: `/Task/${task.id}`, primary: true },
        { label: 'Send reminder', href: `/Task/${task.id}` },
        { label: 'Reassign', href: `/Task/${task.id}` },
      ];
    case 'Order Lab':
      return [
        { label: 'Order', href: `/Task/${task.id}`, primary: true },
        { label: 'Reassign', href: `/Task/${task.id}` },
      ];
    case 'Review Lab':
      return [
        { label: 'Review', href: `/Task/${task.id}`, primary: true },
        { label: 'Reassign', href: `/Task/${task.id}` },
      ];
    case 'Review Imaging':
      return [
        { label: 'Review', href: `/Task/${task.id}`, primary: true },
        { label: 'Reassign', href: `/Task/${task.id}` },
      ];
    default:
      return [
        { label: 'Review', href: `/Task/${task.id}`, primary: true },
        { label: 'Reassign', href: `/Task/${task.id}` },
      ];
  }
}
