import { Card, Group, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { ApiDefinition } from '../types/api';

interface ApiListProps {
  apis: ApiDefinition[];
  selectedId: string | null;
  onSelect: (api: ApiDefinition) => void;
}

export function ApiList({ apis, selectedId, onSelect }: ApiListProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Catálogo de APIs</Title>
          <Text c="dimmed">{apis.length} registradas</Text>
        </Group>
        <ScrollArea h={360} type="auto">
          <Stack gap="sm">
            {apis.map((api) => (
              <Card
                key={api.id}
                padding="md"
                radius="md"
                withBorder
                style={{
                  cursor: 'pointer',
                  borderColor: api.id === selectedId ? '#ff6f3c' : undefined,
                  background: api.id === selectedId ? 'rgba(255, 111, 60, 0.1)' : undefined
                }}
                onClick={() => onSelect(api)}
              >
                <Title order={5}>{api.name}</Title>
                <Text size="sm" c="dimmed">
                  {api.owner}
                </Text>
                <Text size="xs" mt="xs" c="orange.4">
                  {api.baseUrl}
                </Text>
              </Card>
            ))}
            {apis.length === 0 && <Text c="dimmed">No hay APIs registradas todavía.</Text>}
          </Stack>
        </ScrollArea>
      </Stack>
    </Card>
  );
}
