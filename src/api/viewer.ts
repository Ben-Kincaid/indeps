import { ParsedLock } from "./parsers";
import http from "http";
import path from "path";

interface ViewerOpts {
  port: number;
  lockData?: ParsedLock;
}

const renderTemplate = ({
  lockData,
  title
}: {
  lockData: ParsedLock;
  title: string;
}) => {
  const appPath = path.join(__dirname, "../public");
  const scriptPath = path.join(appPath, "app.js");

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Indeps - ${title}</title>
    <script src="${scriptPath}"></script>
  </head>
  <body>
    <div id="app"></div>
    <script>
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
  }

  async startServer() {
    if (!this.lockData) {
      throw new Error("No lockdata found.");
    }
    const server = http.createServer().listen(this.viewerPort);

    server.on("request", (req, res) => {
      const doc = renderTemplate({
        lockData: this.lockData as ParsedLock,
        title: "Test Project"
      });
      res.writeHead(200, { "content-type": "text/html" });
      res.end(doc);
    });

    server.on("close", () => {
      return true;
    });
  }
}

export default Viewer;
