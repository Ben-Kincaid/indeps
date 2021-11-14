<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Ben-Kincaid/indeps">
    <img src="docs/assets/logo.svg" alt="Logo" width="253" height="68">
  </a>

<h3 align="center">Indeps</h3>

  <p align="center">
    🔍 Visualize the dependencies & sub-dependencies in your Javascript application.
    <br />
    <a href="https://github.com/Ben-Kincaid/indeps"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Ben-Kincaid/indeps">View Demo</a>
    ·
    <a href="https://github.com/Ben-Kincaid/indeps/issues">Report Bug</a>
    ·
    <a href="https://github.com/Ben-Kincaid/indeps/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage-as-a-cli-utility">Usage (as a CLI utility)</a></li>
    <li><a href="#usage-as-a-function">Usage (as a function)</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- Add image of viewer here once complete -->

Package management in the javascript ecosystem is both critically important and daunting. Combing through your lockfiles is annoying, and is not helpful when trying to get a bigger picture of your applications dependency tree. `Indeps` was created to help detect issues with your dependencies and their sub-dependencies along with ability to easily visualize the packages that are being used in your javascript codebase.

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

**Indeps** can be ran as either a CLI or using the exported function.

### Prerequisites

- Node v12+

### Installation

Indeps can be installed locally or globally.

To install Indeps on a per-project basis:

```zsh
npm i -D indeps
# or
yarn add -D indeps
```

Alternatively, installing indeps globally allows you to run it easily on any of your local projects. To install globally, run:

```zsh
npm i -g indeps
# or
yarn global add indeps
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage (as a CLI utility)

Indeps can be used a CLI utility to visualize the dependencies defined within any `yarn.lock` file - even if it is not inside a specific project.

If the package was installed globally, you are able to run `indeps` while within any project directory with a valid `yarn.lock` file. Alternatively, you can specify a specific file you want to be used for the visualization through the `--file` flag:

```zsh
# Can use either a path relative to your current directory
indeps --file project/yarn.lock
# Or specify an absolute path
indeps --file /users/steve/my-project/yarn.lock
# leaving it empty will check for a lockfile in the current directory
indeps
```

## Options (for CLI utility)

### `file`

Path to the lockfile to use for visualization.

### `port`

Port that will be used to run the visualizer.

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage (as a function)

Indeps can also be used declaratively when using `node`. Simply import the default export method:

```js
import indeps from "indeps";

// start indeps
indeps({
  lock: {
    type: "yarn",
    path: "/path/to/yarn.lock"
  }
});
```

Our current focus is CLI usage - the exported method will be expanded with more usable options and defaults as we get closer `v1.0.0`.

## Options (as a function)

**TBD**

<!-- ROADMAP -->

## Roadmap

- [] Add `package-lock.json` support
- [] Expand function export to be more usable
- [] Provide more advanced visualization options
  - [] Dependency tree view

See the [open issues](https://github.com/Ben-Kincaid/indeps/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Ben Kincaid - [@BenKincaidWeb](https://twitter.com/BenKincaidWeb) - ben@benkincaid.com

Project Link: [https://github.com/Ben-Kincaid/indeps](https://github.com/Ben-Kincaid/indeps)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Ben-Kincaid/indeps.svg?style=for-the-badge
[contributors-url]: https://github.com/Ben-Kincaid/indeps/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Ben-Kincaid/indeps.svg?style=for-the-badge
[forks-url]: https://github.com/Ben-Kincaid/indeps/network/members
[stars-shield]: https://img.shields.io/github/stars/Ben-Kincaid/indeps.svg?style=for-the-badge
[stars-url]: https://github.com/Ben-Kincaid/indeps/stargazers
[issues-shield]: https://img.shields.io/github/issues/Ben-Kincaid/indeps.svg?style=for-the-badge
[issues-url]: https://github.com/Ben-Kincaid/indeps/issues
[license-shield]: https://img.shields.io/github/license/Ben-Kincaid/indeps.svg?style=for-the-badge
[license-url]: https://github.com/Ben-Kincaid/indeps/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
