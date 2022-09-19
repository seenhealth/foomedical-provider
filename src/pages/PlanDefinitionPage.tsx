import { normalizeErrorString } from '@medplum/core';
import { PlanDefinition } from '@medplum/fhirtypes';
import {
  Avatar,
  Document,
  PlanDefinitionBuilder,
  ResourceTable,
  Scrollable,
  Tab,
  TabList,
  TabPanel,
  TabSwitch,
  useMedplum,
} from '@medplum/react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PatientHeader.css';
import './PatientPage.css';
import { PlanDefinitionApplyForm } from './PlanDefinitionApplyForm';

export function PlanDefinitionPage(): JSX.Element {
  const navigate = useNavigate();
  const { id, tab } = useParams() as {
    id: string;
    tab: string;
  };
  const medplum = useMedplum();
  const planDefinition = medplum.readResource('PlanDefinition', id).read() as PlanDefinition;
  const defaultTab = 'preview';

  function onSubmit(newResource: PlanDefinition): void {
    medplum
      .updateResource(newResource)
      .then(() => toast.success('Success'))
      .catch((err) => toast.error(normalizeErrorString(err)));
  }

  return (
    <>
      <Scrollable className="medplum-surface" height={100}>
        <div className="medplum-patient-header">
          <Avatar alt="C P" size="large" color="#888" />
          <div className="medplum-patient-header-details">
            <div>
              <strong>Title:</strong> {planDefinition.title}
            </div>
            <div>
              <strong>Publisher:</strong> {planDefinition.publisher}
            </div>
          </div>
        </div>
      </Scrollable>
      <TabList value={tab || defaultTab} onChange={(newTab) => navigate(`/PlanDefinition/${id}/${newTab}`)}>
        <Tab name="preview" label="Preview" />
        <Tab name="editor" label="Editor" />
        <Tab name="assign" label="Assign" />
      </TabList>
      <Document>
        <TabSwitch value={tab || defaultTab}>
          <TabPanel name="preview">
            <ResourceTable value={planDefinition} ignoreMissingValues={true} />
          </TabPanel>
          <TabPanel name="editor">
            <h2>Editor</h2>
            <PlanDefinitionBuilder value={planDefinition} onSubmit={onSubmit} />
          </TabPanel>
          <TabPanel name="assign">
            <h2>Assign</h2>
            <PlanDefinitionApplyForm planDefinition={planDefinition} />
          </TabPanel>
        </TabSwitch>
      </Document>
    </>
  );
}
