# Sågarstugan Songbook

Sågarstugan's songbook (PWA) webapp!

This project is built with [Vite](https://vitest.dev) as a [React](https://reactjs.org) + [TypeScript](https://www.typescriptlang.org) web-app using [Yarn Classic](https://classic.yarnpkg.com/) as the package manager.

## Getting started

```sh
yarn install # install dependencies

yarn dev # start local server
```

### Testing PWA functionallity

PWA features don't work when running `yarn dev` so to test something dependant on this you have to run:

```sh
yarn build

yarn start
```

## Contributing

All contributions are welcome! But to maintain code readability and make contributions as easy as possible please follow these guidelines.

### Formatting

Code style is maintained using Prettier and the rules provided in [`.prettierrc`](./.prettierrc)

There are two commands to use prettier from the terminal

```sh
yarn lint # validates code styling

yarn format # formats code
```

### Issues

To keep track of what work needs to/should be done, what is being done and what has been done we use the issues on GitHub.

All commits should include either `Related to #X` to or `Resolves #X` in the commit message. As in the following example:

```
Add some feature

Add this
Remove that
Update something

Resolve #13
```

This is done to make reading the history easy and understanding what the purspose of each commit was.

### Changelog and versioning

All changes should include an update to the changelog and a version bump. The format on the changelog is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The only time where a version bump should not take place is when the additions/updates are hidden (e.g. a view that is not accessable).

### History

Keep the history [simple and clean](https://www.youtube.com/watch?v=B1nDzB1P8GM). Try to keep it to one commit for one issue, if you feel like it's getting too big, then the issue is probably too big – split it up!

## Deployment

Self-hosted with Docker Compose. The images (`songbook` and `songlist`) are built
and pushed manually with the Docker CLI, then pulled on the host:

```sh
docker compose pull && docker compose up -d
```

`nginx` fronts both services on port 8091 and proxies `/songs.json` to the songlist.
See `docker-compose.yml` and `nginx.conf`.
