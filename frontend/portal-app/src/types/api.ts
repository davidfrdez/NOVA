export interface ApiEndpoint {
  name: string;
  path: string;
  httpMethod: string;
  description?: string;
}

export interface ApiTestPayload {
  id: string;
  endpointName: string;
  httpMethod: string;
  relativePathOverride?: string | null;
  createdOn: string;
  jsonBody?: string;
}

export interface ApiDefinition {
  id: string;
  name: string;
  owner: string;
  baseUrl: string;
  productionUrl?: string;
  testPort?: number;
  description?: string;
  endpoints: ApiEndpoint[];
  tests: ApiTestPayload[];
}

export interface ApiRegistrationRequest {
  name: string;
  owner: string;
  baseUrl: string;
  productionUrl?: string;
  testPort?: number;
  description?: string;
  endpoints: ApiEndpoint[];
}

export interface ApiTestRequest {
  endpointName: string;
  httpMethod: string;
  relativePathOverride?: string;
  jsonBody: string;
}

export interface ApiTestExecutionResult {
  statusCode: number;
  responseBody: string;
  responseHeaders: Record<string, string[]>;
}
