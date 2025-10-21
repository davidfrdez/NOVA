import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { apiClient } from '../services/apiClient';
import { ApiEndpoint, ApiRegistrationRequest } from '../types/api';

interface ApiFormProps {
  onRegistered: () => void;
}

const emptyEndpoint: ApiEndpoint = {
  name: '',
  path: '',
  httpMethod: 'GET'
};

const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export function ApiForm({ onRegistered }: ApiFormProps) {
  const [form, setForm] = useState<ApiRegistrationRequest>({
    name: '',
    owner: '',
    baseUrl: '',
    productionUrl: '',
    testPort: undefined,
    description: '',
    endpoints: [emptyEndpoint]
  });

  const handleEndpointChange = (index: number, field: keyof ApiEndpoint, value: string) => {
    setForm((current) => {
      const endpoints = [...current.endpoints];
      endpoints[index] = { ...endpoints[index], [field]: value };
      return { ...current, endpoints };
    });
  };

  const addEndpoint = () => {
    setForm((current) => ({ ...current, endpoints: [...current.endpoints, { ...emptyEndpoint }] }));
  };

  const removeEndpoint = (index: number) => {
    setForm((current) => ({
      ...current,
      endpoints: current.endpoints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    await apiClient.registerApi(form);
    setForm({
      name: '',
      owner: '',
      baseUrl: '',
      productionUrl: '',
      testPort: undefined,
      description: '',
      endpoints: [emptyEndpoint]
    });
    onRegistered();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Registrar nueva API</Title>
        <TextInput label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.currentTarget.value })} required />
        <TextInput label="Equipo / Owner" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.currentTarget.value })} required />
        <TextInput label="URL base" value={form.baseUrl} onChange={(event) => setForm({ ...form, baseUrl: event.currentTarget.value })} required />
        <TextInput label="URL producción" value={form.productionUrl ?? ''} onChange={(event) => setForm({ ...form, productionUrl: event.currentTarget.value })} />
        <NumberInput label="Puerto pruebas" value={form.testPort ?? ''} onChange={(value) => setForm({ ...form, testPort: Number(value) || undefined })} />
        <Textarea label="Descripción" value={form.description ?? ''} minRows={2} onChange={(event) => setForm({ ...form, description: event.currentTarget.value })} />
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text fw={600}>Endpoints ({form.endpoints.length})</Text>
            <ActionIcon variant="light" color="orange" onClick={addEndpoint} aria-label="Añadir endpoint">
              <IconPlus size={16} />
            </ActionIcon>
          </Group>
          {form.endpoints.map((endpoint, index) => (
            <Card key={index} withBorder padding="md" radius="md" style={{ background: 'rgba(255, 111, 60, 0.05)' }}>
              <Stack gap="xs">
                <Group align="flex-end" grow>
                  <TextInput label="Nombre" value={endpoint.name} onChange={(event) => handleEndpointChange(index, 'name', event.currentTarget.value)} required />
                  <TextInput label="Path" value={endpoint.path} onChange={(event) => handleEndpointChange(index, 'path', event.currentTarget.value)} required />
                  <TextInput
                    label="Método"
                    value={endpoint.httpMethod}
                    onChange={(event) => handleEndpointChange(index, 'httpMethod', event.currentTarget.value.toUpperCase())}
                    list={`http-methods-${index}`}
                    required
                  />
                  <datalist id={`http-methods-${index}`}>
                    {httpMethods.map((method) => (
                      <option key={method} value={method} />
                    ))}
                  </datalist>
                </Group>
                <Textarea
                  label="Descripción"
                  value={endpoint.description ?? ''}
                  minRows={1}
                  onChange={(event) => handleEndpointChange(index, 'description', event.currentTarget.value)}
                />
                {form.endpoints.length > 1 && (
                  <Group justify="flex-end">
                    <ActionIcon variant="subtle" color="red" onClick={() => removeEndpoint(index)} aria-label="Eliminar endpoint">
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
        <Button onClick={handleSubmit} color="orange">
          Registrar API
        </Button>
      </Stack>
    </Card>
  );
}
