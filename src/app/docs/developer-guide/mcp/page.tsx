import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "MCP Integration",
  description: "Connect external tools via Model Context Protocol servers.",
};

const PAGE_PATH = "/docs/developer-guide/mcp";

export default function McpIntegrationPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="MCP Integration"
        description="Connect external tools via Model Context Protocol servers."
      >
        <h2>What is MCP?</h2>
        <p>
          The <strong>Model Context Protocol (MCP)</strong> is an open standard
          for connecting AI agents to external tools and data sources. Franklin
          supports MCP natively &mdash; any MCP server can be plugged in as a
          tool provider.
        </p>

        <h2>Server Discovery</h2>
        <p>
          Franklin discovers MCP servers from three locations, checked in order.
          Later sources override earlier ones:
        </p>
        <ol>
          <li>
            <strong>Built-in</strong> &mdash; the <code>blockrun</code> MCP
            server ships with Franklin and provides access to BlockRun&apos;s
            API gateway (search, wallet, markets, models).
          </li>
          <li>
            <strong>Global</strong> &mdash;{" "}
            <code>~/.blockrun/mcp.json</code>. Servers defined here are
            available in every project.
          </li>
          <li>
            <strong>Project</strong> &mdash; <code>.mcp.json</code> in the
            project root. Scoped to the current project only.
          </li>
        </ol>

        <h2>Configuration Format</h2>
        <p>
          Both <code>~/.blockrun/mcp.json</code> and <code>.mcp.json</code>{" "}
          use the same format:
        </p>
        <CodeBlock language="json">
          {`{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@example/mcp-server"],
      "env": {
        "API_KEY": "your-key"
      }
    }
  }
}`}
        </CodeBlock>

        <h2>Transports</h2>

        <h3>stdio (default)</h3>
        <p>
          The most common transport. Franklin spawns the MCP server as a child
          process and communicates over stdin/stdout.
        </p>
        <CodeBlock language="json">
          {`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/docs"]
    }
  }
}`}
        </CodeBlock>

        <h3>HTTP (SSE)</h3>
        <p>
          For remote MCP servers, use HTTP with Server-Sent Events. Specify a{" "}
          <code>url</code> instead of <code>command</code>:
        </p>
        <CodeBlock language="json">
          {`{
  "mcpServers": {
    "remote-tools": {
      "url": "https://mcp.example.com/sse",
      "headers": {
        "Authorization": "Bearer your-token"
      }
    }
  }
}`}
        </CodeBlock>

        <Callout type="info" title="Auto-wrapping">
          MCP tools are automatically wrapped as{" "}
          <code>CapabilityHandlers</code>. The agent sees them alongside
          built-in tools with no extra configuration. Tool names are prefixed
          with the server name (e.g.,{" "}
          <code>mcp__filesystem__read_file</code>).
        </Callout>

        <h2>Using MCP Tools</h2>
        <p>
          Once configured, MCP tools are immediately available. The agent
          discovers them on startup and can call them like any built-in tool.
          To see which MCP servers are connected:
        </p>
        <CodeBlock language="bash">
          {`# Inside a Franklin session
/mcp`}
        </CodeBlock>
        <p>
          This lists all connected MCP servers and their available tools.
        </p>

        <h2>Example: Adding a Database Server</h2>
        <p>
          Add a PostgreSQL MCP server so Franklin can query your database:
        </p>
        <CodeBlock language="json">
          {`{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}`}
        </CodeBlock>
        <p>
          Save this to <code>.mcp.json</code> in your project root, then
          restart Franklin. The agent can now run SQL queries through the{" "}
          <code>postgres</code> tools.
        </p>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
