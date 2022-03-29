<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Ben-Kincaid/indeps">
    <img src="docs/assets/logo.svg" alt="indeps" width="253" height="68">
  </a>

<h3 align="center">indeps</h3>

  <p align="center">
    🔍 Visualize the dependencies & sub-dependencies in your Javascript application.
    <br />
    <a href="https://github.com/Ben-Kincaid/indeps/issues">Report Bug</a>
    ·
    <a href="https://github.com/Ben-Kincaid/indeps/issues">Request Feature</a>
  </p>
</div>
<br />
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
     <li><a href="#how-it-works">How it works</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage </a>
     <ul>
        <li><a href="#as-a-cli-utility">As a CLI utility</a></li>
        <li><a href="#using-the-exported-methods">Using the exported methods</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- Add image of viewer here once complete -->

**indeps** is a tool for visualizing the dependencies that make up your JavaScript application. Combing through your lockfile is tedious, and isn't a very efficient way to understand the "bigger picture" of the packages within your project. Discovering the source of clashing dependencies or the dependency path for a specific module can be time consuming, and wears down your `CMD + F` keys. **indeps** attempts to solve this issue by providing a human-friendly UI for displaying & analyzing your projects resolved dependencies.

- Easily search through the dependencies & sub-dependencies within your JavaScript project.
- View the dependency tree for any given package.
- Filter dependencies by various criteria, such as showing only the `@types` packages. Or, only show the packages that you've defined as a development dependency for the project.
- _**Coming soon:**_ Visualize your dependencies in a treemap and/or graph.

## How it works

On the surface, **indeps** simply parses both your lockfile (either `yarn.lock` or `package-lock.json`) and your `package.json` file, runs additional analysis on these files, and injects this normalized data into a UI that is served by a local HTTP server. Currently, **indeps** requires:

- A valid lockfile
  - Supports Yarn V1, Yarn V2(berry), and NPM(5+) lock files.
- A valid `package.json` file
  - As of `v0.1.0`, we require a valid package.json file to run the indeps process. We require information about the `devDependencies` & `dependencies` that are defined in your `package.json` file, and certain lockfile formats do not provide sufficient indication as to which package/package resolution points to a package that the application defined as a dependency or development dependency. In the future, we may allow lockfile-only analysis, with a limited feature set compared to a full lockfile + `package.json` analysis.

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

**indeps** can be ran as either a CLI, or one may also utilize our various function exports to run the **indeps** processes programatically.

### Prerequisites

- Node v12+

### Installation

indeps can be installed locally or globally.

To install indeps on a per-project basis:

```bash
npm i -D indeps@0.1.0
# or
yarn add -D indeps@0.1.0
```

Alternatively, installing indeps globally allows you to run it easily on any of your local projects. To install globally, run:

```bash
npm i -g indeps@0.1.0
# or
yarn global add indeps@0.1.0
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### As a CLI utility

indeps can be used a CLI utility to visualize the dependencies defined within any `yarn.lock` file - even if it is not inside a specific project.

If the package was installed globally, you can simply run **indeps** within any project directory with a valid lockfile & `package.json` file. Alternatively, you can specify the files you want to be used for the visualization through the `--lock`(`-l`) and `--pkg` flags:

```bash
# Can use either a path relative to your current directory
indeps --lock my-project/yarn.lock --pkg my-project/package.json
# Or specify an absolute path
indeps --lock /users/steve/my-project/yarn.lock --pkg /users/steve/my-project/package.json
# leaving it empty will check for a package.json/lockfile in the current directory
indeps
```

#### `--lock`/`-l`

Path to the lockfile to use for visualization.

#### `--pkg`

Path to the `package.json` file to use for the visualization.

#### `--port`/`-p`

The port used to serve the local **indeps** client. Defaults to `8088`.

#### `--open`/`-o`

If the indeps process should automatically open the client in a browser if one is available on the host machine. Defaults to `true`.

You may also use `--no-open` as an alias for `--open false`

#### `--quiet`/`-q`

Disables the default informational log messages; only display warning & error logs. Defaults to `false`.

<p align="right">(<a href="#top">back to top</a>)</p>

### Using the exported methods

Although **indeps** was made primarily with CLI usage in mind, we also export some high-level methods that allow you to run the various steps of the indeps process programatically. This provides a way for users to extend the functionality of indeps, or create plugins & extensions for bundlers or task runners.

```js
import fs from "fs";

import {
  /** Parses a string-representation of `package.json` to an indeps-compatible parsed object */
  parsePkg,
  /** Parses a string-representation of a `yarn.lock` or `package-lock.json` file to an indeps-compatible parsed object */
  parseLock,
  /** Generates a dependency graph based on the object returned from `parseLock` */
  createDependencyGraph,
  /** Normalizes all data into a single object. */
  createDependencyData,
  /** A function that creates an instance of the "Viewer", responsible for managing the local server that handles serving the indeps UI. */
  createViewer
} from "indeps";

(async () => {
  // Get the raw data of the "package.json" file
  const pkgData = fs.readFileSync("/path/to/package.json", "utf8");

  // Parse raw data using `parsePkg`
  const pkg = parsePkg({
    data: pkgData
  });

  // Get the raw data of the lockfile
  const lockData = fs.readFileSync(
    "/path/to/package-lock.json", // or `yarn.lock`
    "utf8"
  );

  // Parse using `parseLock`
  const lock = parseLock({
    type: "yarn",
    data: lockData
  });

  // create a DAG from the packages specified in the lockfile. This is used to determine the require path - or dependency tree - of each module.
  const graph = createDependencyGraph(lock);

  // Normalize & hydrate all of the necessary data into a complete dependency list.
  const data = createDependencyData({
    lock,
    pkg,
    graph
  });

  // create the viewer instance. The viewer is responsible for running a local HTTP server and serving the indeps UI.
  const viewer = createViewer({
    data,
    port: 8008,
    packageName: parsedPkg.name,
    open: true
  });

  // start the server. Returns a node HTTP server instance (`node.httpServer`).
  const server = await viewer.startServer();
})();
```

Current focus is CLI usage - the exported method will be expanded with more usable options and defaults as we get closer `v1.0.0`.

<p align="right">(<a href="#top">back to top</a>)</p>
<!-- ROADMAP -->

## Roadmap

| Status | Milestone                                                      |
| ------ | -------------------------------------------------------------- |
| 🚀     | **Implement NPM & Yarn V2 (berry) support**                    |
| 🚧     | **Improve dependency list UI**                                 |
| 🚧     | **Create dependency graph/treemap visualization capabilities** |
| 🚧     | **Static site generation**                                     |
| 🚧     | **Rewrite of method exports, plugin & theme support**          |

See the [open issues](https://github.com/Ben-Kincaid/indeps/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
