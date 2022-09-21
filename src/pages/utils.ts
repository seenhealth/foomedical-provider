import { Task } from '@medplum/fhirtypes';

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

export function getTaskType(task: Task): string {
  const ref = task.focus?.reference;
  if (ref) {
    if (ref.startsWith('Appointment')) {
      return 'Schedule a Patient Visit';
    }
    if (ref.startsWith('Questionnaire')) {
      return 'Request Completion of a Questionnaire';
    }
    if (ref.startsWith('ServiceRequest')) {
      return 'Order';
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

export function getTaskActions(task: Task): { label: string; href: string; primary?: boolean; onClick?: () => void }[] {
  const href = getTaskHref(task);
  switch (getTaskType(task)) {
    case 'Schedule a Patient Visit':
      return [{ label: 'Schedule', href, primary: true }];
    case 'Request Completion of a Questionnaire':
      return [
        { label: 'Send to Patient', href, primary: true },
        { label: 'Send reminder', href: `/Task/${task.id}` },
      ];
    case 'Order':
      return [{ label: 'Order', href, primary: true }];
    case 'Review Lab':
      return [{ label: 'Review', href, primary: true }];
    case 'Review Imaging':
      return [{ label: 'Review', href, primary: true }];
    default:
      return [{ label: 'Review', href, primary: true }];
  }
}

export function getTaskHref(task: Task): string {
  if (task.for && task.focus) {
    return `/${task.for?.reference}/${task.focus?.reference}?task=${task.id}`;
  }
  return `/Task/${task.id}`;
}
