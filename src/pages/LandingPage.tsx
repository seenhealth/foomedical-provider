import { Document } from '@medplum/react';
import React from 'react';
import { Link } from 'react-router-dom';

export function LandingPage(): JSX.Element {
  return (
    <Document>
      <h1>Foo Provider</h1>
      <p>
        <Link to="/signin">Sign in</Link>
      </p>
    </Document>
  );
}
