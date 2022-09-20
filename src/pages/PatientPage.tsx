import { DiagnosticReport, Patient, ServiceRequest } from '@medplum/fhirtypes';
import { Document, Loading, Tab, TabList, TabPanel, TabSwitch, useMedplum } from '@medplum/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PatientHeader } from './PatientHeader';
import './PatientPage.css';

interface PatientGraphQLResponse {
  data: {
    patient: Patient;
    orders: ServiceRequest[];
    reports: DiagnosticReport[];
  };
}

export function PatientPage(): JSX.Element {
  const navigate = useNavigate();
  const { id, tab } = useParams() as {
    id: string;
    tab: string;
  };
  const medplum = useMedplum();
  const [response, setResponse] = useState<PatientGraphQLResponse>();

  useEffect(() => {
    const query = `{
      patient: Patient(id: "${id}") {
        resourceType,
        id,
        meta { lastUpdated },
        birthDate,
        name {
          given,
          family
        },
        telecom {
          system,
          value
        },
        address {
          line,
          city,
          state
        }
        photo {
          contentType
          url
        }
      },
      orders: ServiceRequestList(subject: "Patient/${id}") {
        resourceType,
        id,
        meta { lastUpdated },
        category {
          text
        },
        code {
          text
        }
      },
      reports: DiagnosticReportList(subject: "Patient/${id}") {
        resourceType,
        id,
        meta { lastUpdated },
        code {
          text
        }
      }
    }`;
    medplum.graphql(query).then(setResponse);
  }, [medplum, id]);

  if (!response) {
    return <Loading />;
  }

  const { patient, orders, reports } = response.data;
  const defaultTab = 'overview';

  return (
    <>
      <PatientHeader patient={patient} />
      <TabList value={tab || defaultTab} onChange={(newTab) => navigate(`/Patient/${id}/${newTab}`)}>
        <Tab name="overview" label="Overview" />
        <Tab name="visits" label="Visits" />
        <Tab name="labreports" label="Labs & Imaging" />
        <Tab name="careplans" label="Care Plans" />
        <Tab name="forms" label="Forms" />
      </TabList>
      <Document>
        <TabSwitch value={tab || defaultTab}>
          <TabPanel name="overview">
            <h2>Overview</h2>
            <ul>
              <li>Encounters</li>
              <li>ServiceRequests</li>
              <li>DiagnosticReports</li>
            </ul>
          </TabPanel>
          <TabPanel name="visits">
            <h2>Visits</h2>
            <ul>
              <li>Encounters</li>
            </ul>
          </TabPanel>
          <TabPanel name="labreports">
            <h2>Labs & Imaging</h2>
            <ul>
              <li>DiagnosticReports</li>
              <li>ImagingStudys</li>
            </ul>
          </TabPanel>
          <TabPanel name="careplans">
            <h2>Care Plans</h2>
            <ul>
              <li>CarePlans</li>
              <li>RequestGroups</li>
            </ul>
          </TabPanel>
          <TabPanel name="forms">
            <h2>Documents</h2>
            <ul>
              <li>Media</li>
              <li>DocumentReference</li>
              <li>Questionnaire</li>
              <li>QuestionnaireResponse</li>
            </ul>
          </TabPanel>
        </TabSwitch>
      </Document>
    </>
  );
}

function formatDate(date: string | undefined): string {
  if (!date) {
    return '';
  }
  const d = new Date(date);
  return d.toLocaleDateString();
}
