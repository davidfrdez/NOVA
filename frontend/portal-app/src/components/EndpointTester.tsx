import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Code,
  Group,
  JsonInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { apiClient } from '../services/apiClient';
import { ApiDefinition, ApiTestPayload } from '../types/api';

interface EndpointTesterProps {
  api: ApiDefinition | null;
  onTestSaved: (apiId: string) => void;
  onExecute: (apiId: string, payload: ApiTestPayload) => void;
}

export function EndpointTester({ api, onTestSaved, onExecute }: EndpointTesterProps) {
  const [selectedPayloadId, setSelectedPayloadId] = useState<string | null>(null);
  const [jsonBody, setJsonBody] = useState<string>('{}');
  const [endpointName, setEndpointName] = useState<string>('');
  const [httpMethod, setHttpMethod] = useState<string>('GET');
  const [relativePath, setRelativePath] = useState<string>('');
  const [saveLoading, setSaveLoading] = useState(false);

  const options = useMemo(
    () =>
      api?.tests.map((payload) => ({
        value: payload.id,
        label: `${payload.endpointName} (${payload.httpMethod})`
      })) ?? [],
    [api?.tests]
  );

  const endpoints = useMemo(() => api?.endpoints ?? [], [api?.endpoints]);

  const handleSave = async () => {
    if (!api) return;
    setSaveLoading(true);
    try {
      await apiClient.saveTest(api.id, {
        endpointName: endpointName || endpoints[0]?.name || '',
        httpMethod,
        relativePathOverride: relativePath || undefined,
        jsonBody
      });
      onTestSaved(api.id);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleExecute = () => {
    if (!api || !selectedPayloadId) return;
    const payload = api.tests.find((item) => item.id === selectedPayloadId);
    if (payload) {
      onExecute(api.id, payload);
    }
  };

  if (!api) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text c="dimmed">Selecciona una API para gestionar sus pruebas.</Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Probador de endpoints</Title>
        <Select
          label="Endpoint"
          placeholder="Selecciona un endpoint"
          data={endpoints.map((endpoint) => ({ label: `${endpoint.httpMethod} ${endpoint.path}`, value: endpoint.name }))}
          value={endpointName}
          onChange={(value) => setEndpointName(value ?? '')}
        />
        <Group grow align="flex-end">
          <Select
            label="Método"
            data={['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => ({ value: method, label: method }))}
            value={httpMethod}
            onChange={(value) => setHttpMethod(value ?? 'GET')}
          />
          <TextInput label="Path relativo" value={relativePath} onChange={(event) => setRelativePath(event.currentTarget.value)} />
        </Group>
        <JsonInput
          label="JSON de prueba"
          placeholder="{ }"
          validationError="JSON inválido"
          formatOnBlur
          value={jsonBody}
          onChange={setJsonBody}
          autosize
          minRows={6}
        />
        <Group justify="flex-end">
          <Button variant="light" onClick={handleSave} loading={saveLoading} color="orange">
            Guardar JSON
          </Button>
        </Group>
        <Stack gap="sm">
          <Title order={5}>Pruebas guardadas</Title>
          <Select
            placeholder="Selecciona un JSON guardado"
            data={options}
            value={selectedPayloadId}
            onChange={(value) => setSelectedPayloadId(value)}
          />
          <Button disabled={!selectedPayloadId} onClick={handleExecute} color="green">
            Ejecutar prueba
          </Button>
        </Stack>
        <div>
          <Text size="sm" c="dimmed">
            Últimos payloads (JSON)
          </Text>
          <Stack gap="xs">
            {api.tests.map((payload) => (
              <Card key={payload.id} padding="sm" radius="md" withBorder>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">
                    {payload.endpointName} • {payload.httpMethod}
                  </Text>
                  <Code block>{payload.jsonBody ?? '{ }'}</Code>
                </Stack>
              </Card>
            ))}
            {api.tests.length === 0 && <Text c="dimmed">Aún no hay pruebas registradas.</Text>}
          </Stack>
        </div>
      </Stack>
    </Card>
  );
}
