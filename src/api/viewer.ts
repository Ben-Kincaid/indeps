import { ParsedLock } from "./parsers";
import http from "http";
import path, { dirname } from "path";
import logger from "./logger";
import sirv from "sirv";

interface ViewerOpts {
  port: number;
  lockData: ParsedLock;
  indepsVersion: string;
  packageName?: string;
}

const projectRoot = path.join(__dirname, "..");

const renderTemplate = ({
  lockData,
  packageName,
  indepsVersion
}: {
  lockData: ParsedLock;
  packageName?: string;
  indepsVersion: string;
}) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Indeps - ${packageName}</title>
    <script src="/bundle.js" type="text/javascript"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript">
      window.indeps__VERSION = ${indepsVersion || '""'};
      window.indeps__PACKAGE_NAME = ${packageName || '""'};
      window.indeps__LOCK_DATA = ${JSON.stringify(lockData)};
    </script>
  </body>
</html>`;
};

class Viewer {
  viewerPort: number;
  lockData: ParsedLock;
  indepsVersion: string;
  packageName?: string;

  constructor(opts: ViewerOpts) {
    this.viewerPort = opts.port;
    this.lockData = opts.lockData;
    this.packageName = opts.packageName;
    this.indepsVersion = opts.indepsVersion;
    this.handleServerRequest = this.handleServerRequest.bind(this);
  }

  handleServerRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    if (req.method === "GET" && req.url === "/") {
      const doc = renderTemplate({
        lockData: this.lockData,
        packageName: this.packageName,
        indepsVersion: this.indepsVersion
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
