import http from "http";
import path from "path";

import sirv from "sirv";
import open from "open";

import { ParsedData } from "src/types";
import { IndepsError } from "src/error";

interface ViewerOpts {
  port: number;
  data: ParsedData;
  indepsVersion: string;
  packageName?: string;
  open?: boolean;
}

interface RenderOpts {
  data: ParsedData;
  packageName?: string;
  indepsVersion: string;
}

const projectRoot = path.join(__dirname, "..");

const renderTemplate = ({
  data,
  packageName,
  indepsVersion
}: RenderOpts) => {
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
      window.indeps__VERSION = "${indepsVersion || ""}";
      window.indeps__PACKAGE_NAME = "${packageName || ""}";
      window.indeps__DATA = ${JSON.stringify(data)};
    </script>
  </body>
</html>`;
};

class Viewer {
  viewerPort: number;
  data: ParsedData;
  indepsVersion: string;
  packageName?: string;
  open?: boolean;

  constructor(opts: ViewerOpts) {
    this.viewerPort = opts.port;
    this.data = opts.data;
    this.packageName = opts.packageName;
    this.indepsVersion = opts.indepsVersion;
    this.open = opts.open === undefined ? true : opts.open;

    this.handleServerRequest = this.handleServerRequest.bind(this);
  }

  handleServerRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    if (req.method === "GET" && req.url === "/") {
      const doc = renderTemplate({
        data: this.data,
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

  startServer(): Promise<http.Server> {
    return new Promise((resolve) => {
      if (!this.data || this.data.length === 0) {
        throw new IndepsError("No lockdata found.");
      }

      const server = http
        .createServer(this.handleServerRequest)
        .listen(this.viewerPort, "127.0.0.1", () => {
          // open browser to the server
          if (this.open)
            open(`http://127.0.0.1:${this.viewerPort}`, {
              wait: false
            });

          resolve(server);
        });
    });
  }
}

export default Viewer;
