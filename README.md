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

**indeps** was created to provide developers with an efficient & intuitive way to visualize the dependencies in their javascript application. Combing through your lockfile is tedious, and isn't an effective way to view the "bigger picture" of the packages that make up your project. Discovering the source of clashing dependencies or the require path for a specific module can be time consuming, and wears down your `CMD + F` keys. **indeps** attempts to solve this issue by providing a human-friendly UI for displaying your projects resolved dependencies - along with useful data not generally provided in your lockfile, such as a package's dependency tree.

## How it works

On the surface, **indeps** simply parses your lockfile (either `yarn.lock` or `package-lock.json`) and `package.json` file, runs additional analysis on these files, and injects normalized + hydrated data into the client, being served by a local HTTP server. Currently, **indeps** requires:

- A valid lockfile
  - Supports Yarn V1, Yarn V2(berry), and NPM(5+) lock files.
- A valid `package.json` file
  - As of `v0.1.0`, we will be requiring a valid package.json file to run the full indeps process. We require information about the `devDependencies` & `dependencies` that are defined in your `package.json` file, and `package-lock.json` does not give us any guaranteed indicators as to which package/package resolution points to a file the application defined as a dependency or development dependency.

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

**indeps** can be ran as either a CLI, or one may also utilize our various function exports to run the **indeps** processes programatically.

### Prerequisites

- Node v12+

### Installation

indeps can be installed locally or globally.

To install indeps on a per-project basis:

```zsh
npm i -D indeps@0.1.0
# or
yarn add -D indeps@0.1.0
```

Alternatively, installing indeps globally allows you to run it easily on any of your local projects. To install globally, run:

```zsh
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
  parsePkg,
  parseLock,
  createDependencyGraph,
  createDependencyData,
  createViewer
} from "indeps";

(async () => {
  // Get the raw data of the "package.json" file
  const pkgData = fs.readFileSync("/path/to/package.json", "utf8");

  // Parse raw data using `parsePkg`
  const parsedPkg = parsePkg({
    data: pkgData
  });

  // Get the raw data of the lockfile
  const lockData = fs.readFileSync(
    "/path/to/package-lock.json", // or `yarn.lock`
    "utf8"
  );

  // Parse using `parseLock`
  const parsedLock = parseLock({
    type: "yarn",
    data: lockData
  });

  // create a DAG from the packages specified in the lockfile. This is used to determine the require path - or dependency tree - of a specific module specified in `yarn.lock` or `package-lock.json`.
  const graph = createDependencyGraph(lock);

  // Normalize & hydrate all of the necessary data into a complete dependency list.
  const data = createDependencyData({
    lock: parsedLock,
    pkg: parsedPkg,
    graph
  });

  // create the viewer instance. The viewer is responsible for running a local HTTP server and serving the indeps UI.
  const viewer = createViewer({
    data,
    port: 8008,
    packageName: parsedPkg.name,
    open: true
  });

  // start the server. Returns the instance of the underlying HTTP server.
  const server = await viewer.startServer();
})();
```

Current focus is CLI usage - the exported method will be expanded with more usable options and defaults as we get closer `v1.0.0`.

<p align="right">(<a href="#top">back to top</a>)</p>
<!-- ROADMAP -->

## Roadmap

| Status | Milestone                                              |
| ------ | ------------------------------------------------------ |
| 🚀     | **Implement NPM & Yarn V2 (berry) support**            |
| 🚧     | **Improve dependency list UI**                         |
| 🚧     | **Create dependency graph visualization capabilities** |
| 🚧     | **Rewrite of method exports, plugin & theme support**  |

See the [open issues](https://github.com/Ben-Kincaid/indeps/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
