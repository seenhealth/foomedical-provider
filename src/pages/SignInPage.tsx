import { Logo, SignInForm } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function SignInPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <SignInForm
      projectId="daae901c-c8d7-4246-9f24-486147b82224"
      googleClientId="75003594095-ddoaug1q6fq2dd8ab6278p81nignvs3p.apps.googleusercontent.com"
      onSuccess={() => navigate('/')}
    >
      <Logo size={32} />
      <h1>Sign in to Foo Provider</h1>
    </SignInForm>
  );
}
