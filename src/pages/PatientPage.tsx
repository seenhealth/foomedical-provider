import { formatDateTime, getPropertyDisplayName } from '@medplum/core';
import {
  Appointment,
  CodeableConcept,
  DiagnosticReport,
  Patient,
  Resource,
  ResourceType,
  ServiceRequest,
} from '@medplum/fhirtypes';
import {
  Button,
  CodeableConceptDisplay,
  DiagnosticReportDisplay,
  Document,
  Loading,
  MedplumLink,
  StatusBadge,
  Tab,
  TabList,
  TabPanel,
  TabSwitch,
  useMedplum,
} from '@medplum/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PatientHeader } from './PatientHeader';
import { TaskHeader } from './TaskHeader';

import './PatientPage.css';

interface PatientGraphQLResponse {
  data: {
    patient: Patient;
    appointments: Appointment[];
    orders: ServiceRequest[];
    reports: DiagnosticReport[];
  };
}

export function PatientPage(): JSX.Element {
  const navigate = useNavigate();
  const params = useParams() as { id: string; tab: string; resourceId: string };
  const { id, resourceId } = params;

  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('task');

  const medplum = useMedplum();
  const resource = (resourceId && medplum.readResource(params.tab as ResourceType, resourceId).read()) as Resource;

  const [response, setResponse] = useState<PatientGraphQLResponse>();

  useEffect(() => {
    const query = `{
      patient: Patient(id: "${id}") {
        resourceType,
        id,
        meta { lastUpdated },
        birthDate,
        name { given, family },
        telecom { system, value },
        address { line, city, state },
        photo { contentType, url }
      },
      appointments: AppointmentList(actor: "Patient/${id}") {
        resourceType,
        id,
        meta { lastUpdated },
        serviceCategory { coding { code, display } },
        serviceType { coding { code, display } },
        start,
        end,
        status
      },
      orders: ServiceRequestList(subject: "Patient/${id}") {
        resourceType,
        id,
        meta { lastUpdated },
        category { text },
        code { text }
      },
      reports: DiagnosticReportList(subject: "Patient/${id}") {
        resourceType,
        id,
        meta { lastUpdated },
        code { text }
      }
    }`;
    medplum.graphql(query).then(setResponse);
  }, [medplum, id]);

  if (!response) {
    return <Loading />;
  }

  const { patient, appointments, orders, reports } = response.data;

  const allResources = [...appointments, ...orders, ...reports];
  allResources.sort((a, b) => (a.meta?.lastUpdated as string).localeCompare(b.meta?.lastUpdated as string));

  const tab = resolveTab(params.tab);

  return (
    <>
      {taskId && <TaskHeader taskId={taskId} />}
      <PatientHeader patient={patient} />
      <TabList value={tab} onChange={(newTab) => navigate(`/Patient/${id}/${newTab}?task=${taskId}`)}>
        <Tab name="overview" label="Overview" />
        <Tab name="visits" label="Visits" />
        <Tab name="labreports" label="Labs &amp; Imaging" />
        <Tab name="careplans" label="Care Plans" />
        <Tab name="forms" label="Forms" />
      </TabList>
      <Document>
        <TabSwitch value={tab}>
          <TabPanel name="overview">
            <OverviewTab id={id} taskId={taskId} allResources={allResources} />
          </TabPanel>
          <TabPanel name="visits">
            <VisitsTab appointments={appointments} />
          </TabPanel>
          <TabPanel name="labreports">
            <LabAndImagingTab resource={resource} />
          </TabPanel>
          <TabPanel name="careplans">
            <CarePlansTab />
          </TabPanel>
          <TabPanel name="forms">
            <FormsTab />
          </TabPanel>
        </TabSwitch>
      </Document>
    </>
  );
}

function OverviewTab({
  allResources,
  id,
  taskId,
}: {
  allResources: Resource[];
  id: string;
  taskId: string | null;
}): JSX.Element {
  return (
    <>
      <h2>Overview</h2>
      <ul>
        {allResources.map((resource) => (
          <li key={resource.id}>
            <MedplumLink to={`/Patient/${id}/${resource.resourceType}/${resource.id}?task=${taskId}`}>
              {getPropertyDisplayName(resource.resourceType)}
            </MedplumLink>
            <br />
            <small>{formatDateTime(resource.meta?.lastUpdated)}</small>
          </li>
        ))}
      </ul>
    </>
  );
}

function VisitsTab({ appointments }: { appointments: Appointment[] }): JSX.Element {
  return (
    <>
      <h2>Visits</h2>
      <table className="foo-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Last Updated</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr>
              <td>
                <CodeableConceptDisplay value={appointment.serviceCategory?.[0] as CodeableConcept} />
              </td>
              <td>
                <CodeableConceptDisplay value={appointment.serviceType?.[0] as CodeableConcept} />
              </td>
              <td>{formatDateTime(appointment.meta?.lastUpdated)}</td>
              <td>
                <StatusBadge status={appointment.status as string} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function LabAndImagingTab({ resource }: { resource: Resource | undefined }): JSX.Element {
  if (resource) {
    if (resource.resourceType === 'DiagnosticReport') {
      if (resource.presentedForm) {
        return (
          <>
            <h2>Labs &amp; Imaging</h2>
            <embed src={resource.presentedForm[0].url} width="850" height="600" type="application/pdf"></embed>
            <hr />
            <Button primary={true} size="large">
              Approve
            </Button>
          </>
        );
      }
      return <DiagnosticReportDisplay value={resource} />;
    }
  }
  return (
    <>
      <h2>Labs &amp; Imaging</h2>
      {resource ? (
        <div>
          <pre>{JSON.stringify(resource, null, 2)}</pre>
        </div>
      ) : (
        <ul>
          <li>DiagnosticReports</li>
          <li>ImagingStudys</li>
        </ul>
      )}
    </>
  );
}

function CarePlansTab(): JSX.Element {
  return (
    <>
      <h2>Care Plans</h2>
      <ul>
        <li>CarePlans</li>
        <li>RequestGroups</li>
      </ul>
    </>
  );
}

function FormsTab(): JSX.Element {
  return (
    <>
      <h2>Forms</h2>
      <ul>
        <li>Questionnaire</li>
        <li>QuestionnaireResponse</li>
      </ul>
    </>
  );
}

function resolveTab(input: string): string {
  if (!input) {
    return 'overview';
  }
  if (input === 'Appointment') {
    return 'visits';
  }
  if (input === 'DiagnosticReport' || input === 'ImagingStudy') {
    return 'labreports';
  }
  if (input === 'CarePlan' || input === 'RequestGroup') {
    return 'careplans';
  }
  if (
    input === 'Media' ||
    input === 'DocumentReference' ||
    input === 'Questionnaire' ||
    input === 'QuestionnaireResponse'
  ) {
    return 'forms';
  }
  return input;
}
