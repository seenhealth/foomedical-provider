import { createReference, formatGivenName, getReferenceString } from '@medplum/core';
import { HumanName, Practitioner } from '@medplum/fhirtypes';
import { Document, Timeline, TimelineItem, useMedplum, useMedplumProfile } from '@medplum/react';
import React from 'react';

export function HomePage(): JSX.Element {
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const profileRef = createReference(profile);
  // const patients: Patient[] = medplum.searchResources('Patient').read();

  // if (!patients) {
  //   return <Loading />;
  // }

  const tasks = medplum.searchResources('Task', 'owner=' + getReferenceString(profile)).read();

  return (
    <>
      <Document>
        <h1>Welcome {formatGivenName(profile.name?.[0] as HumanName)}</h1>
      </Document>
      <Timeline>
        {tasks?.map((task) => (
          <TimelineItem profile={profileRef} resource={task}>
            <div style={{ padding: '2px 16px' }}>
              <pre>{JSON.stringify(task, null, 2)}</pre>
            </div>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}
