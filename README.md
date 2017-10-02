# React Scripts
This repository exposes the `react-scripts` binary, a small set of tools that handles configuration and time-consuming tasks for you.

## Table of Contents
- [Installation](#installation)
- [Development](#development)
- [Scripts](#scripts)
  - [analyze](#analyze)
  - [build](#build)
  - [codegen](#codegen)
  - [start](#start)
  - [test](#test)
  - [translate](#translate)

## Installation
Just a matter of cloning the repository and installing dependencies:

```
yarn install
```

## Development
When you start the app, any changes you make will be automatically compiled.

```
yarn start
```

Typically, you will want to link this as a dependency in another project to test your changes live.

To link this repository, you must first register this project as a linkable dependency. From this project path:

```
yarn link
```

Then, from the other project's path:

```
yarn link @keenai/react-scripts
```

## Scripts

### analyze
```
react-scripts analyze
```

Will output a `stats.json` file that contains bundle statistics. Useful in tandem with a tool such as [Webpack Visualizer](https://chrisbateman.github.io/webpack-visualizer/).

### build
```
react-scripts build
```

Bundles the application, optimized for best performance in a production environment.

The build is minified and the filenames include hashes.

### codegen
```
react-scripts codegen <graphUrl>
```

You must pass this task a valid GraphQL endpoint (e.g. `react-scripts codegen https://graph.keenai.com/graphql`).

It will generate a `schema.json` file for linting GraphQL queries.

It will also generate a flow definition file in `flow-typed/schema.js.flow` for statically typing queries.

### start
```
react-scripts start
```

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### test
```
react-scripts test
```

Launches the test runner in the interactive watch mode.

### translate
```
react-scripts translate [--out, -o] [Output File]
```

This task uses [babel-plugin-react-intl](https://github.com/yahoo/babel-plugin-react-intl) to extract translatable strings from your project.

All messages are extracted to the build path, then concatenated and transformed to a single `csv` file, which is then written to the given output file path.

The output file can be changed with the `--out, -o` option, which defaults to `src/i18n/localizable.csv`.
