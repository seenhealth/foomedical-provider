import { formatSearchQuery, parseSearchDefinition, SearchRequest } from '@medplum/core';
import { Document, Loading, MemoizedSearchControl, useMedplum } from '@medplum/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function PatientsList(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState<SearchRequest>();

  useEffect(() => {
    const newSearch = parseSearchDefinition('Patient?' + location.search);
    newSearch.fields = ['name', 'birthdate'];
    setSearch(newSearch);
  }, [medplum, location]);

  if (!search) {
    return <Loading />;
  }

  return (
    <Document>
      <h2>Patients</h2>
      <MemoizedSearchControl
        hideToolbar={true}
        hideFilters={true}
        checkboxesEnabled={true}
        search={search}
        userConfig={medplum.getUserConfiguration()}
        onClick={(e) => navigate(`/${e.resource.resourceType}/${e.resource.id}`)}
        onAuxClick={(e) => window.open(`/${e.resource.resourceType}/${e.resource.id}`, '_blank')}
        onChange={(e) => {
          navigate(`/${search.resourceType}${formatSearchQuery(e.definition)}`);
        }}
        onNew={() => navigate(`/${search.resourceType}/new`)}
      />
    </Document>
  );
}
