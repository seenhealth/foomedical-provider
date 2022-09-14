import { UserConfiguration } from '@medplum/fhirtypes';
import { ErrorBoundary, Header, Loading, useMedplum } from '@medplum/react';
import React, { Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
import { PatientPage } from './pages/PatientPage';
import { PatientsList } from './pages/PatientsList';
import { ProfilePage } from './pages/ProfilePage';
import { ResourcePage } from './pages/ResourcePage';
import { SignInPage } from './pages/SignInPage';
import { TaskPage } from './pages/TaskPage';

export function App(): JSX.Element | null {
  const navigate = useNavigate();
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
          { name: 'Patients', target: '/patients' },
          { name: 'Visits', target: '/visits' },
          { name: 'Forms', target: '/forms' },
          { name: 'Reports', target: '/reports' },
          { name: 'Care Plans', target: '/careplans' },
          { name: 'Messages', target: '/messages' },
          { name: 'Rx', target: '/rx' },
        ],
      },
    ],
  };

  return (
    <>
      {profile && (
        <Header
          bgColor="#202020"
          title="Foo Provider"
          onLogo={() => navigate('/')}
          onProfile={() => navigate(`/profile`)}
          onSignOut={() => {
            medplum.signOut();
            navigate('/signin');
          }}
          config={config}
        />
      )}
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={profile ? <HomePage /> : <LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/Patient/:id/:tab" element={<PatientPage />} />
            <Route path="/Patient/:id" element={<PatientPage />} />
            <Route path="/Task/:id" element={<TaskPage />} />
            <Route path="/:resourceType/:id" element={<ResourcePage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
