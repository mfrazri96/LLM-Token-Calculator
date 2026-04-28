import {
  getAiBenchmarkMetadata,
  getAiBenchmarkModels,
  getAiBenchmarkProviders,
  getAiBenchmarkSnapshot,
  type AiBenchmarkRequest,
  type AiBenchmarkResponse,
  type AiBenchmarkValidationError
} from "../server/aiBenchmarkService";

export type AiBenchmarkApiResponse =
  | ({
      ok: true;
    } & Extract<AiBenchmarkResponse, { ok: true }>["benchmark"])
  | Extract<AiBenchmarkResponse, { ok: false }>;

function jsonResponse(body: unknown, status: number): Response {
  const headers = new Headers();
  headers.set("content-type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(body), {
    status,
    headers
  });
}

function errorResponse(status: number, field: AiBenchmarkValidationError["field"], message: string): Response {
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

function requestToBenchmarkInput(request: Request): AiBenchmarkRequest {
  const url = new URL(request.url);

  return {
    provider: url.searchParams.get("provider") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined
  };
}

export function getAiBenchmarkForApi(input: AiBenchmarkRequest = {}): AiBenchmarkResponse {
  return getAiBenchmarkSnapshot(input);
}

export function handleAiBenchmarkRequest(request: Request): Response {
  if (request.method.toUpperCase() !== "GET") {
    return errorResponse(405, "request", "Use GET to list AI benchmark models.");
  }

  const result = getAiBenchmarkSnapshot(requestToBenchmarkInput(request));

  if (!result.ok) {
    return jsonResponse(result, 400);
  }

  return jsonResponse(
    {
      ok: true,
      ...result.benchmark
    } satisfies AiBenchmarkApiResponse,
    200
  );
}

export { getAiBenchmarkMetadata, getAiBenchmarkModels, getAiBenchmarkProviders };
