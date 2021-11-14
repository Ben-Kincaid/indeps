import { ParsedLock } from "./parsers";
import http from "http";
import path, { dirname } from "path";
import logger from "./logger";
import { fileURLToPath } from "url";
import sirv from "sirv";

interface ViewerOpts {
  port: number;
  lockData?: ParsedLock;
}

const projectRoot = path.join(__dirname, "..");

const renderTemplate = ({
  lockData,
  title
}: {
  lockData: ParsedLock;
  title: string;
}) => {
  const appPath = path.join(__dirname, "../public");
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Indeps - ${title}</title>
    <script src="/bundle.js" type="text/javascript"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript">
      window.lockData = ${JSON.stringify(lockData)};
    </script>
  </body>
</html>`;
};

class Viewer {
  viewerPort: number;
  lockData?: ParsedLock;

  constructor(opts: ViewerOpts) {
    this.viewerPort = opts.port;
    this.lockData = opts.lockData;

    this.handleServerRequest = this.handleServerRequest.bind(this);
  }

  handleServerRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    if (req.method === "GET" && req.url === "/") {
      const doc = renderTemplate({
        lockData: this.lockData as ParsedLock,
        title: "Test Project"
      });

      res.writeHead(200, { "content-type": "text/html" });
      res.end(doc);
    } else {
      sirv(`${projectRoot}/public`, {
        dev: true
      })(req, res);
    }
  }

  async startServer() {
    logger.log({
      level: "info",
      msg: "🔍 Warming up server..."
    });

    if (!this.lockData) {
      throw new Error("No lockdata found.");
    }
    const server = http
      .createServer(this.handleServerRequest)
      .listen(this.viewerPort, "localhost", () => {
        logger.log({
          level: "info",
          msg: `🟢  Indeps started. Visit at http://localhost:${this.viewerPort}`
        });
      });
  }
}

export default Viewer;
