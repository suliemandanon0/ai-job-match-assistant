import { createServer } from "node:http";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { handler } from "./handler.js";

const port = Number(process.env.PORT ?? 3001);

const server = createServer(async (req, res) => {
  const method = req.method ?? "GET";
  const url = req.url ?? "/";

  if (url !== "/analyze" || (method !== "POST" && method !== "OPTIONS")) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > 50_000) {
      res.writeHead(413, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Request too large." }));
      return;
    }
    chunks.push(chunk as Buffer);
  }

  const event = {
    requestContext: { http: { method } },
    body: Buffer.concat(chunks).toString("utf-8"),
    isBase64Encoded: false,
  } as unknown as APIGatewayProxyEventV2;

  const result: APIGatewayProxyStructuredResultV2 = await handler(event);

  res.writeHead(
    result.statusCode ?? 200,
    result.headers as Record<string, string>
  );
  res.end(result.body ?? "");
});

server.listen(port, () => {
  console.log(`Local API listening on http://localhost:${port}/analyze`);
});
