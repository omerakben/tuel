/**
 * TUEL Development Server
 *
 * A comprehensive development server with hot reloading, debugging,
 * and development tools for TUEL components.
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const { execSync } = require("child_process");

class TUELDevServer {
  constructor(options = {}) {
    this.port = options.port || 3000;
    this.hotReload = options.hotReload !== false;
    this.debugMode = options.debugMode || false;
    this.watchPaths = options.watchPaths || ["src", "packages"];
    this.app = express();
    this.watcher = null;
    this.clients = new Set();

    this.setupMiddleware();
    this.setupRoutes();
    this.setupHotReload();
  }

  setupMiddleware() {
    // CORS for hot reload
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    // Static files
    this.app.use(express.static(path.join(__dirname, "..", "dist")));
    this.app.use(express.static(path.join(__dirname, "..", "public")));

    // JSON parsing
    this.app.use(express.json());
  }

  setupRoutes() {
    // Health check
    this.app.get("/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // Component playground
    this.app.get("/playground", (req, res) => {
      res.send(this.generatePlaygroundHTML());
    });

    // Debug interface
    this.app.get("/debug", (req, res) => {
      res.send(this.generateDebugHTML());
    });

    // Component API
    this.app.get("/api/components", (req, res) => {
      const components = this.getAvailableComponents();
      res.json(components);
    });

    // Performance metrics
    this.app.get("/api/performance", (req, res) => {
      const metrics = this.getPerformanceMetrics();
      res.json(metrics);
    });

    // Error reporting
    this.app.post("/api/errors", (req, res) => {
      this.handleErrorReport(req.body);
      res.json({ status: "received" });
    });

    // Hot reload endpoint
    this.app.get("/hot-reload", (req, res) => {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      this.clients.add(res);

      req.on("close", () => {
        this.clients.delete(res);
      });
    });

    // Serve main app
    this.app.get("*", (req, res) => {
      res.send(this.generateAppHTML());
    });
  }

  setupHotReload() {
    if (!this.hotReload) return;

    this.watcher = chokidar.watch(this.watchPaths, {
      ignored: /node_modules/,
      persistent: true,
    });

    this.watcher.on("change", (filePath) => {
      console.log(`🔄 File changed: ${filePath}`);
      this.notifyClients("reload", { file: filePath });

      // Rebuild if needed
      if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
        this.rebuildComponent(filePath);
      }
    });

    this.watcher.on("add", (filePath) => {
      console.log(`➕ File added: ${filePath}`);
      this.notifyClients("add", { file: filePath });
    });

    this.watcher.on("unlink", (filePath) => {
      console.log(`➖ File removed: ${filePath}`);
      this.notifyClients("remove", { file: filePath });
    });
  }

  notifyClients(type, data) {
    const message = `data: ${JSON.stringify({
      type,
      data,
      timestamp: Date.now(),
    })}\n\n`;

    this.clients.forEach((client) => {
      try {
        client.write(message);
      } catch (error) {
        this.clients.delete(client);
      }
    });
  }

  rebuildComponent(filePath) {
    try {
      console.log(`🔨 Rebuilding component: ${filePath}`);
      execSync("npm run build", { stdio: "pipe" });
      console.log("✅ Component rebuilt successfully");
    } catch (error) {
      console.error("❌ Component rebuild failed:", error.message);
    }
  }

  getAvailableComponents() {
    const componentsDir = path.join(__dirname, "..", "packages");
    const components = [];

    if (fs.existsSync(componentsDir)) {
      const packages = fs.readdirSync(componentsDir);

      packages.forEach((packageName) => {
        const packagePath = path.join(componentsDir, packageName, "src");
        if (fs.existsSync(packagePath)) {
          const files = fs.readdirSync(packagePath);
          files.forEach((file) => {
            if (
              file.endsWith(".tsx") &&
              !file.endsWith(".test.tsx") &&
              !file.endsWith(".stories.tsx")
            ) {
              components.push({
                name: file.replace(".tsx", ""),
                package: packageName,
                path: path.join(packagePath, file),
              });
            }
          });
        }
      });
    }

    return components;
  }

  getPerformanceMetrics() {
    return {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }

  handleErrorReport(errorData) {
    console.error("🐛 Error reported:", errorData);
    // Here you would typically send to error tracking service
  }

  generatePlaygroundHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TUEL Playground</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            color: #333;
            margin: 0;
            font-size: 2.5rem;
        }
        .header p {
            color: #666;
            margin: 10px 0 0 0;
        }
        .components-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .component-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            background: #f9f9f9;
        }
        .component-card h3 {
            margin: 0 0 15px 0;
            color: #333;
        }
        .component-preview {
            min-height: 100px;
            border: 1px dashed #ccc;
            border-radius: 4px;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
        }
        .code-section {
            margin-top: 40px;
        }
        .code-section h2 {
            color: #333;
            margin-bottom: 20px;
        }
        pre {
            background: #f4f4f4;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid #e0e0e0;
        }
        code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
        }
        .status {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body>
    <div class="status" id="status">🟢 Connected</div>

    <div class="container">
        <div class="header">
            <h1>🎨 TUEL Playground</h1>
            <p>Interactive component testing and development environment</p>
        </div>

        <div class="components-grid" id="components-grid">
            <!-- Components will be loaded here -->
        </div>

        <div class="code-section">
            <h2>📝 Code Examples</h2>
            <pre><code id="code-example">// Components will be loaded here...</code></pre>
        </div>
    </div>

    <script>
        // Hot reload connection
        const eventSource = new EventSource('/hot-reload');
        const statusEl = document.getElementById('status');

        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);

            if (data.type === 'reload') {
                statusEl.textContent = '🔄 Reloading...';
                statusEl.style.background = '#FF9800';

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        };

        eventSource.onerror = function() {
            statusEl.textContent = '🔴 Disconnected';
            statusEl.style.background = '#f44336';
        };

        // Load components
        fetch('/api/components')
            .then(response => response.json())
            .then(components => {
                const grid = document.getElementById('components-grid');
                const codeExample = document.getElementById('code-example');

                components.forEach(component => {
                    const card = document.createElement('div');
                    card.className = 'component-card';
                    card.innerHTML = \`
                        <h3>\${component.name}</h3>
                        <div class="component-preview">
                            <p>Component preview for \${component.name}</p>
                        </div>
                    \`;
                    grid.appendChild(card);
                });

                if (components.length > 0) {
                    codeExample.textContent = \`// Example usage:
import { \${components[0].name} } from '@tuel/\${components[0].package}';

function App() {
  return (
    <\${components[0].name}>
      Hello TUEL!
    </\${components[0].name}>
  );
}\`;
                }
            });
    </script>
</body>
</html>
    `;
  }

  generateDebugHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TUEL Debug</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: #fff;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 2.5rem;
        }
        .debug-panel {
            background: #2a2a2a;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .debug-panel h2 {
            color: #4CAF50;
            margin-top: 0;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #444;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-label {
            color: #ccc;
        }
        .metric-value {
            color: #fff;
            font-weight: bold;
        }
        .log-container {
            background: #000;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
            max-height: 300px;
            overflow-y: auto;
        }
        .log-entry {
            margin-bottom: 5px;
        }
        .log-entry.error {
            color: #f44336;
        }
        .log-entry.warning {
            color: #FF9800;
        }
        .log-entry.info {
            color: #2196F3;
        }
        .log-entry.success {
            color: #4CAF50;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 TUEL Debug</h1>
            <p>Development debugging and monitoring tools</p>
        </div>

        <div class="debug-panel">
            <h2>📊 Performance Metrics</h2>
            <div id="metrics">
                <!-- Metrics will be loaded here -->
            </div>
        </div>

        <div class="debug-panel">
            <h2>📝 Live Logs</h2>
            <div class="log-container" id="logs">
                <!-- Logs will be displayed here -->
            </div>
        </div>
    </div>

    <script>
        // Load performance metrics
        function loadMetrics() {
            fetch('/api/performance')
                .then(response => response.json())
                .then(metrics => {
                    const metricsEl = document.getElementById('metrics');
                    metricsEl.innerHTML = \`
                        <div class="metric">
                            <span class="metric-label">Memory Usage (MB)</span>
                            <span class="metric-value">\${Math.round(metrics.memory.heapUsed / 1024 / 1024)}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Uptime (seconds)</span>
                            <span class="metric-value">\${Math.round(metrics.uptime)}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Timestamp</span>
                            <span class="metric-value">\${new Date(metrics.timestamp).toLocaleTimeString()}</span>
                        </div>
                    \`;
                });
        }

        // Load logs
        function addLogEntry(message, type = 'info') {
            const logsEl = document.getElementById('logs');
            const entry = document.createElement('div');
            entry.className = \`log-entry \${type}\`;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logsEl.appendChild(entry);
            logsEl.scrollTop = logsEl.scrollHeight;
        }

        // Hot reload connection
        const eventSource = new EventSource('/hot-reload');

        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);
            addLogEntry(\`File \${data.type}: \${data.data.file}\`, 'info');
        };

        eventSource.onerror = function() {
            addLogEntry('Connection lost', 'error');
        };

        // Initial load
        loadMetrics();
        addLogEntry('Debug interface initialized', 'success');

        // Update metrics every 5 seconds
        setInterval(loadMetrics, 5000);
    </script>
</body>
</html>
    `;
  }

  generateAppHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TUEL Development Server</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            color: white;
            max-width: 600px;
            padding: 40px;
        }
        h1 {
            font-size: 3rem;
            margin: 0 0 20px 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            margin: 0 0 40px 0;
            opacity: 0.9;
        }
        .links {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .link {
            display: inline-block;
            padding: 15px 30px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
        }
        .link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .status {
            margin-top: 40px;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        .status h3 {
            margin: 0 0 10px 0;
            color: #4CAF50;
        }
        .status p {
            margin: 5px 0;
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 TUEL</h1>
        <p>Modern TypeScript animation library for React applications</p>

        <div class="links">
            <a href="/playground" class="link">🎮 Playground</a>
            <a href="/debug" class="link">🔍 Debug</a>
            <a href="/api/components" class="link">📦 Components</a>
            <a href="/health" class="link">❤️ Health</a>
        </div>

        <div class="status">
            <h3>🟢 Development Server Running</h3>
            <p>Port: ${this.port}</p>
            <p>Hot Reload: ${this.hotReload ? "Enabled" : "Disabled"}</p>
            <p>Debug Mode: ${this.debugMode ? "Enabled" : "Disabled"}</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(
        `🚀 TUEL Development Server running on http://localhost:${this.port}`
      );
      console.log(`🎮 Playground: http://localhost:${this.port}/playground`);
      console.log(`🔍 Debug: http://localhost:${this.port}/debug`);
      console.log(
        `📦 Components API: http://localhost:${this.port}/api/components`
      );

      if (this.hotReload) {
        console.log(`🔄 Hot reload enabled for: ${this.watchPaths.join(", ")}`);
      }
    });
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }

    this.clients.forEach((client) => {
      client.end();
    });

    console.log("🛑 TUEL Development Server stopped");
  }
}

// Export for use in other modules
module.exports = TUELDevServer;

// Run server if this file is executed directly
if (require.main === module) {
  const server = new TUELDevServer({
    port: process.env.PORT || 3000,
    hotReload: process.env.HOT_RELOAD !== "false",
    debugMode: process.env.DEBUG_MODE === "true",
    watchPaths: process.env.WATCH_PATHS
      ? process.env.WATCH_PATHS.split(",")
      : ["src", "packages"],
  });

  server.start();

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down gracefully...");
    server.stop();
    process.exit(0);
  });
}
