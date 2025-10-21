import { Card, Code, Group, List, Stack, Text, Title } from '@mantine/core';
import { ApiDefinition, ApiTestExecutionResult } from '../types/api';

interface ApiDetailsPanelProps {
  api: ApiDefinition | null;
  executionResult: ApiTestExecutionResult | null;
}

export function ApiDetailsPanel({ api, executionResult }: ApiDetailsPanelProps) {
  if (!api) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text c="dimmed">Selecciona una API del catálogo para ver sus detalles.</Text>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Group justify="space-between" align="baseline">
            <div>
              <Title order={2}>{api.name}</Title>
              <Text c="dimmed">Responsable: {api.owner}</Text>
            </div>
            {api.testPort && <Text size="sm">Puerto pruebas: {api.testPort}</Text>}
          </Group>
          {api.description && <Text size="sm">{api.description}</Text>}
          <Code>{api.baseUrl}</Code>
          {api.productionUrl && (
            <Text size="sm">
              Producción: <Code>{api.productionUrl}</Code>
            </Text>
          )}
          <div>
            <Title order={4}>Endpoints</Title>
            <List spacing="xs" size="sm" icon={null} center>
              {api.endpoints.map((endpoint, index) => (
                <List.Item key={`${endpoint.name}-${index}`}>
                  <Code>{endpoint.httpMethod}</Code> {endpoint.path} — {endpoint.description ?? 'Sin descripción'}
                </List.Item>
              ))}
            </List>
          </div>
        </Stack>
      </Card>
      {executionResult && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <Title order={4}>Resultado de última prueba</Title>
            <Text>Estado HTTP: {executionResult.statusCode}</Text>
            <div>
              <Text size="sm" fw={600}>
                Cabeceras
              </Text>
              <Code block>
                {JSON.stringify(executionResult.responseHeaders, null, 2)}
              </Code>
            </div>
            <div>
              <Text size="sm" fw={600}>
                Cuerpo de respuesta
              </Text>
              <Code block>{executionResult.responseBody}</Code>
            </div>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
