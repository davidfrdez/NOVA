import { useEffect, useState } from 'react';
import { AppShell, Container, Grid, Group, LoadingOverlay, Stack, Text, Title } from '@mantine/core';
import { ApiList } from './components/ApiList';
import { ApiForm } from './components/ApiForm';
import { ApiDetailsPanel } from './components/ApiDetailsPanel';
import { EndpointTester } from './components/EndpointTester';
import { apiClient } from './services/apiClient';
import { ApiDefinition, ApiTestExecutionResult, ApiTestPayload } from './types/api';

function App() {
  const [apis, setApis] = useState<ApiDefinition[]>([]);
  const [selectedApi, setSelectedApi] = useState<ApiDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState<ApiTestExecutionResult | null>(null);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const catalog = await apiClient.listApis();
      setApis(catalog);
      if (!selectedApi && catalog.length > 0) {
        setSelectedApi(catalog[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleRegistered = async () => {
    await loadCatalog();
  };

  const handleTestSaved = async (apiId: string) => {
    await loadCatalog();
    const updated = await apiClient.listApis();
    const refreshed = updated.find((api) => api.id === apiId) ?? null;
    setSelectedApi(refreshed);
  };

  const handleExecute = async (apiId: string, payload: ApiTestPayload) => {
    const result = await apiClient.executeTest(apiId, payload.id);
    setExecutionResult(result);
  };

  return (
    <AppShell padding="xl">
      <AppShell.Main>
        <LoadingOverlay visible={loading} />
        <Container size="xl">
          <Stack gap="xl">
            <Group justify="space-between" align="baseline">
              <div>
                <Title order={1}>Portal Interno de APIs</Title>
                <Text c="dimmed">Inspirado en Backstage, optimizado para equipos MasOrange España.</Text>
              </div>
            </Group>
            <Grid gutter="xl">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="lg">
                  <ApiForm onRegistered={handleRegistered} />
                  <ApiList
                    apis={apis}
                    selectedId={selectedApi?.id ?? null}
                    onSelect={(api) => setSelectedApi(api)}
                  />
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  <ApiDetailsPanel api={selectedApi} executionResult={executionResult} />
                  <EndpointTester api={selectedApi} onTestSaved={handleTestSaved} onExecute={handleExecute} />
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
