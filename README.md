# Foo Provider

## Tasks

| Task                                  | Actions                                  | Data Model                          |
| ------------------------------------- | ---------------------------------------- | ----------------------------------- |
| Schedule a Patient Visit              | Schedule, Reassign                       | Task.focus -> Appointment           |
| Request Completion of a Questionnaire | Send to Patient, Send Reminder, Reassign | Task.focus ->Questionnaire          |
| Order Lab                             | Order                                    | Task.focus -> ServiceRequest        |
|                                       |                                          | ServiceRequest.code.system = LOINC  |
| Review Lab                            | Review Report, Reassign                  | Task.focus -> DiagnosticReport.     |
| Order Imaging Study Order, Review,    | Reassign                                 | Task.focus -> ServiceRequestRequest |
|                                       |                                          | ServiceRequest.code.sysetm = SNOMED |
| Review Imaging                        |                                          | Task.focus -> Imaging Study         |
