import { formatSearchQuery, parseSearchDefinition, SearchRequest } from '@medplum/core';
import { Button, Document, Loading, MemoizedSearchControl, useMedplum } from '@medplum/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function FormsList(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState<SearchRequest>();

  useEffect(() => {
    const newSearch = parseSearchDefinition('Questionnaire?' + location.search);
    newSearch.fields = ['title', 'publisher', '_lastUpdated'];
    setSearch(newSearch);
  }, [medplum, location]);

  if (!search) {
    return <Loading />;
  }

  return (
    <Document>
      <h2>Forms</h2>
      <MemoizedSearchControl
        hideToolbar={true}
        hideFilters={true}
        checkboxesEnabled={false}
        search={search}
        userConfig={medplum.getUserConfiguration()}
        onClick={(e) => navigate(`/${e.resource.resourceType}/${e.resource.id}`)}
        onAuxClick={(e) => window.open(`/${e.resource.resourceType}/${e.resource.id}`, '_blank')}
        onChange={(e) => {
          navigate(`/${search.resourceType}${formatSearchQuery(e.definition)}`);
        }}
        onNew={() => navigate(`/${search.resourceType}/new`)}
      />
      <div>
        <Button primary={true}>New</Button>
        <Button primary={true}>Import</Button>
      </div>
    </Document>
  );
}
