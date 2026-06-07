import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/getting-started/installation" },
  title: "Installation",
  description: "Prerequisites, platforms, and troubleshooting.",
};

const PAGE_PATH = "/docs/getting-started/installation";

export default function InstallationPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Installation"
        description="Prerequisites, platforms, and troubleshooting."
      >
        <h2>Prerequisites</h2>
        <ul>
          <li>
            <strong>Node.js 20+</strong> &mdash; check with{" "}
            <code>node --version</code>
          </li>
          <li>
            <strong>npm</strong> &mdash; ships with Node.js. Check with{" "}
            <code>npm --version</code>
          </li>
        </ul>

        <Callout type="info" title="Node version managers">
          We recommend using <a href="https://github.com/nvm-sh/nvm">nvm</a> or{" "}
          <a href="https://github.com/Schniz/fnm">fnm</a> to manage your
          Node.js installation. This avoids permission issues and makes upgrading
          easy.
        </Callout>

        <h2>Install</h2>
        <p>Install Franklin globally via npm:</p>
        <CodeBlock language="bash">
          {`npm install -g @blockrun/franklin`}
        </CodeBlock>
        <p>
          This adds the <code>franklin</code> command to your PATH.
        </p>

        <h2>Verify</h2>
        <p>Confirm the installation succeeded:</p>
        <CodeBlock language="bash">
          {`franklin --version`}
        </CodeBlock>
        <p>
          You should see the version number (e.g., <code>0.1.0</code>). If you
          see &quot;command not found&quot;, check the troubleshooting section
          below.
        </p>

        <h2>Platforms</h2>
        <h3>macOS</h3>
        <p>
          Fully supported on Apple Silicon (M1/M2/M3/M4) and Intel Macs. Works
          with the default Terminal, iTerm2, Warp, or any terminal emulator.
        </p>

        <h3>Linux</h3>
        <p>
          Fully supported on x86_64 and ARM64 distributions. Tested on Ubuntu
          22.04+, Debian 12+, Fedora 38+, and Arch Linux.
        </p>

        <h3>Windows (WSL2)</h3>
        <p>
          Franklin runs inside WSL2 (Windows Subsystem for Linux). Install
          Node.js inside your WSL2 distribution, not on the Windows side.
        </p>
        <CodeBlock language="bash">
          {`# Inside WSL2
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
npm install -g @blockrun/franklin`}
        </CodeBlock>

        <Callout type="warning" title="Windows native not supported">
          Running Franklin directly on Windows (outside WSL2) is not supported.
          File system operations and shell integration require a Unix-like
          environment.
        </Callout>

        <h2>Troubleshooting</h2>

        <h3>EACCES permission error</h3>
        <p>
          If you see <code>EACCES: permission denied</code> when installing
          globally, do <strong>not</strong> use <code>sudo</code>. Instead, fix
          your npm prefix:
        </p>
        <CodeBlock language="bash">
          {`mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @blockrun/franklin`}
        </CodeBlock>
        <p>
          Or, better yet, switch to a Node version manager like{" "}
          <code>nvm</code> which handles this automatically.
        </p>

        <h3>Command not found after install</h3>
        <p>
          If <code>franklin --version</code> returns &quot;command not
          found&quot;, the npm global bin directory is not in your PATH. Find it
          and add it:
        </p>
        <CodeBlock language="bash">
          {`# Find where npm installs global binaries
npm config get prefix

# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export PATH="$(npm config get prefix)/bin:$PATH"`}
        </CodeBlock>

        <h3>Node.js version too old</h3>
        <p>
          Franklin requires Node.js 20 or later. If you&apos;re on an older
          version, upgrade with your version manager:
        </p>
        <CodeBlock language="bash">
          {`nvm install 22
nvm use 22`}
        </CodeBlock>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
