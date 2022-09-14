import { calculateAgeString, formatAddress, formatHumanName } from '@medplum/core';
import { HumanName, Patient, Reference } from '@medplum/fhirtypes';
import { Avatar, Scrollable, useResource } from '@medplum/react';
import React from 'react';
import './PatientHeader.css';

export interface PatientHeaderProps {
  patient: Patient | Reference<Patient>;
}

export function PatientHeader(props: PatientHeaderProps): JSX.Element | null {
  const patient = useResource(props.patient);
  if (!patient) {
    return null;
  }
  const name = patient.name?.[0] as HumanName;
  const birthDate = patient.birthDate as string;
  const address = patient.address?.[0];
  const email = patient.telecom?.find((t) => t.system === 'email');
  const phone = patient.telecom?.find((t) => t.system === 'phone');

  return (
    <Scrollable className="medplum-surface" height={150}>
      <div className="medplum-patient-header">
        <Avatar value={patient} size="large" color={getDefaultColor(patient)} />
        <div className="medplum-patient-header-details">
          <div>
            <strong>Name:</strong> {formatHumanName(name)}
          </div>
          <div>
            <strong>Birth date:</strong> {birthDate} ({calculateAgeString(birthDate)})
          </div>
          {address && (
            <div>
              <strong>Address:</strong> {formatAddress(address)}
            </div>
          )}
          {email && (
            <div>
              <strong>Email:</strong> {email.value}
            </div>
          )}
          {phone && (
            <div>
              <strong>Phone:</strong> {phone.value}
            </div>
          )}
        </div>
      </div>
    </Scrollable>
  );
}

function getDefaultColor(patient: Patient): string {
  if (patient.gender === 'male') {
    return '#79a3d2'; // blue
  }
  if (patient.gender === 'female') {
    return '#c58686'; // pink
  }
  return '#6cb578'; // green
}
