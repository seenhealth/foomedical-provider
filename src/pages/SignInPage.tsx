import { Text } from '@mantine/core';
import { Logo, SignInForm } from '@medplum/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function SignInPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <SignInForm
      projectId="9602358d-eeb0-4de8-bccf-e2438b5c9162"
      googleClientId="679052511930-8dqur4mmg8egbttgos5pmr4ljtf3etbb.apps.googleusercontent.com"
      onSuccess={() => navigate('/')}
    >
      <Logo size={32} />
      <Text size="lg">Sign in to Foo Provider</Text>
    </SignInForm>
  );
}
