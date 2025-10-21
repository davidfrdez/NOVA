import axios from 'axios';
import { ApiDefinition, ApiRegistrationRequest, ApiTestExecutionResult, ApiTestRequest } from '../types/api';

const client = axios.create({
  baseURL: '/'
});

async function listApis(): Promise<ApiDefinition[]> {
  const response = await client.get<ApiDefinition[]>('/api/catalog');
  return response.data;
}

async function registerApi(request: ApiRegistrationRequest) {
  await client.post('/api/catalog', request);
}

async function saveTest(apiId: string, request: ApiTestRequest) {
  await client.post(`/api/catalog/${apiId}/tests`, request);
}

async function executeTest(apiId: string, payloadId: string): Promise<ApiTestExecutionResult> {
  const response = await client.post<ApiTestExecutionResult>(`/api/catalog/${apiId}/tests/${payloadId}/execute`);
  return response.data;
}

export const apiClient = {
  listApis,
  registerApi,
  saveTest,
  executeTest
};
