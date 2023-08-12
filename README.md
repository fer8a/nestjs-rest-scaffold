<div id="top"></div>
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url] -->



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">NestJS REST Scaffold</h3>

  <p align="center">
    An awesome template to jumpstart your projects!
    <br />
    <a href="https://docs.nestjs.com/"><strong>Explore the NestJS docs »</strong></a>
    <br />
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#folder-structure">Folder Structure</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[NestJS](https://nestjs.com/) is a great Framework to start building very robust server-side applications. There are many great templates available on GitHub; however, I didn't find one that really suited my needs so I created this ~~very opinionated~~ one. I wanted a boilerplate that would integrate many of the great features Nest has to offer, _out-of-the-box_, with the minimun configuration effort to start bootstraping an application right away.

Here's why:
* Your time should be focused on creating something amazing. A project that solves a problem and helps others
* You shouldn't be doing the same tasks over and over; like integrating a DB layer, a microservice layer, etc.
* You should implement DRY principles to the rest of your life as well :)

Of course, no one template will serve all projects since your needs may be different, but here's for everyone who find it helpful.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [NestJS](https://nestjs.com/)
* [Fastify](https://www.fastify.io/)
* [Prisma](https://www.prisma.io/)
* [Pino](https://getpino.io/)
* [Open Telemetry](https://opentelemetry.io/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- FEATURES -->
## Features

Every time I start building an API, a REST microservice, a server-side app; there's always a set of features that I end up reusing over and over given the utility they provide. That's the main reason I have decided to create this project to bootstrap as much of this _core_ functionality as possible.

Let's list a few of the features provided on this project:
- Open Telemetry to instrument, generate, collect, and export telemetry data.
- Terminus module for the healthcheck of your application exposed at `/health` route.
- OpenAPI specification ([Swagger](https://swagger.io/)) for all the `HTTP` routes (Thanks to NestJS CLI plugin).
- Global exception middleware so you can catch and customize any target exception to your likings.
- Global request-logger middleware so all the incoming and outgoing `HTTP` requests are logged by default with their metadata.
- Global Cache middleware to enhance the response time of all the `GET` `HTTP` requests.
- A programmatic way to access `environment` variables through DI.
- A database ORM to interact with mulple DB drivers using the great [Prisma](https://www.prisma.io/) package.
- A programmatic way to generate logs using DI upon the right context of your application.
- An example implementation of a [Kafka](https://kafka.apache.org/) transporter layer with a producer/consumer interface.
- Husky package with _lint-staged_ bundled with _pre-commit and pre-push_ hooks that running linter, formatter and tests

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- FOLDER STRUCTURE -->
## Folder Structure

Following the _Nest way_ of things, I ended up up with a module-based approach when it came to structuring the code.
That being said, the project comes with a series of folders and modules that you can reuse and extend to fit your needs, let's talk a bit about it.
- `config` Like its name implies is a folder to place all sort of configurations for your app. `cache` and `env` configurations live here. You can also and include more modules in it, like your `db` for instance, or any other module that relies on environment variables or externals configurations.
- `config/otel-tracer` Open Telemetry SDK and configuration file.
- `config/db` Quite self explanatory, this is your DB module, the folder to place all your configs and ORM layer.
- `config/logs` Module where you can place the log driver used by your app. Comes with Pino and Winston out of the box.
- `core` This is it, the source of ~~evil~~ the base code. It's a module wrapping the minimun functionality that the app should have, again this is very opinionated of me, so you may choose to adjust it to fit your needs.
- `providers` Folder to place external third-party SDKs or libraries (AWS, Sendgrid, etc).
- `resources` Interfaces and endpoints with the bussiness logic of your app should be placed here. Modules, Controllers, Services and entities related to the solution you're building.
- `resources/healthcheck` This exposes the healthcheck functionality of your app to the `HTTP` transport layer.
- `transporters` Meant for all the microservices and interfaces other than `HTTP` that can se used in your app. Kafka, Redis, TCP, etc.


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* Nest
  ```sh
  npm i -g @nestjs/cli
  ```

### Installation and Usage

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the application
   ```sh
   npm run start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [] Add unit tests

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt