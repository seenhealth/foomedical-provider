import { AppShell } from '@mantine/core';
import { UserConfiguration } from '@medplum/fhirtypes';
import { ErrorBoundary, useMedplum } from '@medplum/react';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { HeaderBar } from './components/HeaderBar';
import { Loading } from './components/Loading';
import { CarePlansList } from './pages/CarePlansList';
import { CreateResourcePage } from './pages/CreateResourcePage';
import { FormsList } from './pages/FormsList';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
import { PatientPage } from './pages/PatientPage';
import { PatientsList } from './pages/PatientsList';
import { PlanDefinitionPage } from './pages/PlanDefinitionPage';
import { ProfilePage } from './pages/ProfilePage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { ReportsPage } from './pages/ReportsPage';
import { ResourcePage } from './pages/ResourcePage';
import { ResourceSearchPage } from './pages/ResourceSearchPage';
import { SchedulePage } from './pages/SchedulePage';
import { SignInPage } from './pages/SignInPage';
import { TaskPage } from './pages/TaskPage';

import 'react-toastify/dist/ReactToastify.css';

export function App(): JSX.Element | null {
  const medplum = useMedplum();

  if (medplum.isLoading()) {
    return null;
  }

  const profile = medplum.getProfile();

  const config: UserConfiguration = {
    resourceType: 'UserConfiguration',
    menu: [
      {
        title: 'Menu',
        link: [
          { name: 'Work List', target: '/' },
          { name: 'Patients', target: '/patients' },
          { name: 'Visits', target: '/visits' },
          { name: 'Forms', target: '/forms' },
          { name: 'Reports', target: '/reports' },
          { name: 'Care Plans', target: '/careplans' },
          { name: 'Messages', target: '/messages' },
          { name: 'Rx', target: '/rx' },
          { name: 'Transition of Care', target: '/Questionnaire/d582df91-be08-420a-80e1-e5ee0aff250c' },
          { name: 'Send Message', target: '/Questionnaire/f1b01312-662c-4fad-80af-53ef1eb319c2' },
        ],
      },
    ],
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={3000}
        hideProgressBar
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AppShell fixed={true} header={profile && <HeaderBar />}>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={profile ? <HomePage /> : <LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/patients" element={<PatientsList />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/visits" element={<SchedulePage />} />
              <Route path="/forms" element={<FormsList />} />
              <Route path="/careplans" element={<CarePlansList />} />
              <Route path="/Patient/:id/:tab/:resourceId" element={<PatientPage />} />
              <Route path="/Patient/:id/:tab" element={<PatientPage />} />
              <Route path="/Patient/:id" element={<PatientPage />} />
              <Route path="/PlanDefinition/:id/:tab" element={<PlanDefinitionPage />} />
              <Route path="/PlanDefinition/:id" element={<PlanDefinitionPage />} />
              <Route path="/Questionnaire/:id/:tab" element={<QuestionnairePage />} />
              <Route path="/Questionnaire/:id" element={<QuestionnairePage />} />
              <Route path="/Task/:id" element={<TaskPage />} />
              <Route path="/:resourceType" element={<ResourceSearchPage />} />
              <Route path="/:resourceType/new" element={<CreateResourcePage />} />
              <Route path="/:resourceType/:id" element={<ResourcePage />} />
              <Route path="/:resourceType/:id/:tab" element={<ResourcePage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AppShell>
    </>
  );
}
