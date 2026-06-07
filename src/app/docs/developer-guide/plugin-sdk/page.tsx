import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/developer-guide/plugin-sdk" },
  title: "Plugin SDK",
  description: "Build custom plugins with workflows, channels, and capability handlers.",
};

const PAGE_PATH = "/docs/developer-guide/plugin-sdk";

export default function PluginSdkPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Plugin SDK"
        description="Build custom plugins with workflows, channels, and capability handlers."
      >
        <h2>Plugin Manifest</h2>
        <p>
          Every plugin is a directory containing a <code>manifest.json</code>{" "}
          that declares its metadata, capabilities, and entry points:
        </p>
        <CodeBlock language="json">
          {`{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "A custom Franklin plugin",
  "capabilities": ["my-tool"],
  "entry": "./index.js",
  "workflows": ["./workflows/default.json"],
  "channels": ["./channels/slack.js"]
}`}
        </CodeBlock>

        <h2>Core Interfaces</h2>

        <h3>Plugin</h3>
        <p>
          The top-level interface. A plugin registers one or more capability
          handlers that the agent can invoke as tools.
        </p>
        <CodeBlock language="typescript">
          {`interface Plugin {
  name: string;
  version: string;
  capabilities: CapabilityHandler[];
  onLoad?(): Promise<void>;
  onUnload?(): Promise<void>;
}`}
        </CodeBlock>

        <h3>CapabilityHandler</h3>
        <p>
          Each capability is a tool the agent can call. It defines a name,
          description, input schema, and an execute function.
        </p>
        <CodeBlock language="typescript">
          {`interface CapabilityHandler {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  execute(input: unknown): Promise<ToolResult>;
}`}
        </CodeBlock>

        <h3>Workflow</h3>
        <p>
          Workflows define multi-step sequences that chain capabilities
          together. They are declared as JSON files in the plugin&apos;s{" "}
          <code>workflows/</code> directory.
        </p>
        <CodeBlock language="json">
          {`{
  "name": "deploy",
  "steps": [
    { "capability": "build", "input": { "target": "production" } },
    { "capability": "test", "input": { "suite": "smoke" } },
    { "capability": "publish", "input": { "registry": "npm" } }
  ]
}`}
        </CodeBlock>

        <h3>Channel</h3>
        <p>
          Channels let plugins send and receive messages through external
          services (Slack, Discord, webhooks, etc.).
        </p>
        <CodeBlock language="typescript">
          {`interface Channel {
  name: string;
  send(message: string): Promise<void>;
  onMessage(callback: (msg: string) => void): void;
}`}
        </CodeBlock>

        <h2>Discovery Order</h2>
        <p>
          Franklin loads plugins in a specific order. Later sources override
          earlier ones if they declare the same capability name:
        </p>
        <ol>
          <li>
            <strong>Dev plugins</strong> &mdash;{" "}
            <code>.franklin/plugins/</code> in the current project directory.
            Highest priority, used during plugin development.
          </li>
          <li>
            <strong>User plugins</strong> &mdash;{" "}
            <code>~/.blockrun/plugins/</code>. Your personal plugins,
            available in every project.
          </li>
          <li>
            <strong>Bundled plugins</strong> &mdash; shipped with Franklin.
            Lowest priority, always available as fallbacks.
          </li>
        </ol>

        <Callout type="tip" title="Dev plugins for rapid iteration">
          During development, place your plugin in{" "}
          <code>.franklin/plugins/</code> inside your project. Franklin
          hot-reloads dev plugins on every agent turn, so you can iterate
          without restarting.
        </Callout>

        <h2>Building a Custom Plugin</h2>
        <p>
          Create a plugin that adds a <code>hello</code> tool:
        </p>
        <CodeBlock language="bash">
          {`mkdir -p .franklin/plugins/hello-plugin
cd .franklin/plugins/hello-plugin`}
        </CodeBlock>
        <p>
          Create <code>manifest.json</code>:
        </p>
        <CodeBlock language="json">
          {`{
  "name": "hello-plugin",
  "version": "1.0.0",
  "description": "Greets the user",
  "capabilities": ["hello"],
  "entry": "./index.js"
}`}
        </CodeBlock>
        <p>
          Create <code>index.js</code>:
        </p>
        <CodeBlock language="javascript">
          {`module.exports = {
  name: "hello-plugin",
  version: "1.0.0",
  capabilities: [
    {
      name: "hello",
      description: "Say hello to someone",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name to greet" }
        },
        required: ["name"]
      },
      async execute(input) {
        return { content: \`Hello, \${input.name}!\` };
      }
    }
  ]
};`}
        </CodeBlock>
        <p>
          Now start Franklin in the project directory. The agent will have
          access to the <code>hello</code> tool automatically.
        </p>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
