import { formatDateTime, normalizeErrorString } from '@medplum/core';
import { Questionnaire } from '@medplum/fhirtypes';
import {
  Avatar,
  Document,
  QuestionnaireBuilder,
  QuestionnaireForm,
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

export function QuestionnairePage(): JSX.Element {
  const navigate = useNavigate();
  const { id, tab } = useParams() as {
    id: string;
    tab: string;
  };
  const medplum = useMedplum();
  const questionnaire = medplum.readResource('Questionnaire', id).read() as Questionnaire;
  const defaultTab = 'preview';

  function onSubmit(newResource: Questionnaire): void {
    medplum
      .updateResource(newResource)
      .then(() => toast.success('Success'))
      .catch((err) => toast.error(normalizeErrorString(err)));
  }

  return (
    <>
      <Scrollable className="medplum-surface" height={100}>
        <div className="medplum-patient-header">
          <div className="medplum-patient-header-details">
            <div>
              <strong>Title:</strong> {questionnaire.title}
            </div>
            <div>
              <strong>Publisher:</strong> {questionnaire.publisher}
            </div>
            <div>
              <strong>Last Updated:</strong> {formatDateTime(questionnaire.meta?.lastUpdated)}
            </div>
          </div>
        </div>
      </Scrollable>
      <TabList value={tab || defaultTab} onChange={(newTab) => navigate(`/Questionnaire/${id}/${newTab}`)}>
        <Tab name="preview" label="Preview" />
        <Tab name="editor" label="Editor" />
      </TabList>
      <Document>
        <TabSwitch value={tab || defaultTab}>
          <TabPanel name="preview">
            <QuestionnaireForm
              key={questionnaire.id}
              questionnaire={questionnaire}
              onSubmit={() => alert('You submitted the preview')}
            />
          </TabPanel>
          <TabPanel name="editor">
            <h2>Editor</h2>
            <QuestionnaireBuilder key={questionnaire.id} questionnaire={questionnaire} onSubmit={onSubmit} />
          </TabPanel>
        </TabSwitch>
      </Document>
    </>
  );
}
