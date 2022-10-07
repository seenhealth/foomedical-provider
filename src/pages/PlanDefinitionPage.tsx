import { normalizeErrorString } from '@medplum/core';
import { PlanDefinition } from '@medplum/fhirtypes';
import { Document, PlanDefinitionBuilder, ResourceAvatar, ResourceTable, useMedplum } from '@medplum/react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlanDefinitionApplyForm } from './PlanDefinitionApplyForm';

import { ScrollArea, Tabs } from '@mantine/core';
import './PatientHeader.css';
import './PatientPage.css';

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
    <Tabs value={tab || defaultTab} onChange={(newTab) => navigate(`/PlanDefinition/${id}/${newTab}`)}>
      <ScrollArea>
        <div className="medplum-patient-header">
          <ResourceAvatar alt="C P" />
          <div className="medplum-patient-header-details">
            <div>
              <strong>Title:</strong> {planDefinition.title}
            </div>
            <div>
              <strong>Publisher:</strong> {planDefinition.publisher}
            </div>
          </div>
        </div>
      </ScrollArea>
      <Tabs.List>
        <Tabs.Tab value="preview">Preview</Tabs.Tab>
        <Tabs.Tab value="editor">Editor</Tabs.Tab>
        <Tabs.Tab value="assign">Assign</Tabs.Tab>
      </Tabs.List>
      <Document>
        <Tabs.Panel value="preview">
          <ResourceTable value={planDefinition} ignoreMissingValues={true} />
        </Tabs.Panel>
        <Tabs.Panel value="editor">
          <h2>Editor</h2>
          <PlanDefinitionBuilder value={planDefinition} onSubmit={onSubmit} />
        </Tabs.Panel>
        <Tabs.Panel value="assign">
          <h2>Assign</h2>
          <PlanDefinitionApplyForm planDefinition={planDefinition} />
        </Tabs.Panel>
      </Document>
    </Tabs>
  );
}
