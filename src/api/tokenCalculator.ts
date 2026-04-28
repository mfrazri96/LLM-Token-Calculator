import {
  calculateTokenUsage,
  getModelCatalog,
  getModelOptions,
  type TokenCalculatorRequest,
  type TokenCalculatorResponse,
  type TokenCalculatorValidationError
} from "../server/tokenCalculatorService";

export type ModelOptionsResponse = {
  ok: true;
} & ReturnType<typeof getModelCatalog>;

function jsonResponse(body: unknown, status: number): Response {
  const headers = new Headers();
  headers.set("content-type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(body), {
    status,
    headers
  });
}

function errorResponse(status: number, field: TokenCalculatorValidationError["field"], message: string): Response {
  return jsonResponse(
    {
      ok: false,
      errors: [
        {
          field,
          message
        }
      ]
    },
    status
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function calculateTokenUsageForApi(input: TokenCalculatorRequest): TokenCalculatorResponse {
  return calculateTokenUsage(input);
}

export async function handleTokenCalculationRequest(request: Request): Promise<Response> {
  if (request.method.toUpperCase() !== "POST") {
    return errorResponse(405, "request", "Use POST to calculate token usage.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "request", "Request body must be valid JSON.");
  }

  if (!isRecord(body)) {
    return errorResponse(400, "request", "Request body must be a JSON object.");
  }

  const result = calculateTokenUsage(body);
  return jsonResponse(result, result.ok ? 200 : 400);
}

export function handleModelOptionsRequest(request: Pick<Request, "method">): Response {
  if (request.method.toUpperCase() !== "GET") {
    return errorResponse(405, "request", "Use GET to list model pricing presets.");
  }

  return jsonResponse(
    {
      ok: true,
      ...getModelCatalog()
    } satisfies ModelOptionsResponse,
    200
  );
}

export { getModelCatalog, getModelOptions };
