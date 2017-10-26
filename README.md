Observe 2ch
==

The purpose of this service is provide ツイッター観察板@2ch watcher, and UX experiment of search query building UI.

Intro duction
--
### Screen Captures
![search query screen](https://gutchom.github.io/observe-2ch-client/assets/img/observe2ch_search_query.gif)
![histor modal on search query screen](https://gutchom.github.io/observe-2ch-client/assets/img/observe2ch_search_history.gif)

### Demo page
[Observe2ch - Search](https://gutchom.github.io/observe-2ch-client/)

How to develop
--
Requires Node.js v8.2.0 or later

### Environment
#### Languages & Libraries
- [TypeScript](http://typescriptlang.org) 2.5.x
- [React.js](http://reactjs.org) 16.x
- [CSSNext](http://cssnext.io)
- [Pug](http://pugjs.org)

#### Build tools
- [Webpack](http://webpack.js.org) 3.x
- [PostCSS](http://postcss.org)

#### Testing
- [Karma.js](http://karma-runner.github.io) (with Chrome Headless)
- [Mocha.js](http://mochajs.org)
- [Power Assert](https://github.com/power-assert-js/power-assert)
- [Sinon.js](http://sinonjs.org)

### Commands
Move to root directory of this project and run `npm install` at first.

- `npm start`
  - Start building and watching `src/*`
  - Open `http://localhost:3333`
- `npm run testing`
  - Start testing and watching `src/scripts/*`
- `npm run build`
  - Build sorce code with production mode

### Directories
- `src/`: Main directory for development
- `server/`: Mock server
- `public/`: Destination directory to output converted files.

#### scripts
`src/scripts/`
- `app/`: Product codes here
  - `entries/`: Entry files to transpile
  - `components/`: React components
  - `stores/`: modules for state management
  - `lib/`: common utilities
- `test/`: Unit test code named with `*.test.ts*`. Its structure should be same as `src/scripts/app/`
- `types/`: Declaration files. Its structure should be same as `src/scripts/app/`

#### styles
`src/styles/`
- `commons/`: General styles. (ex. variables.css, reset.css, etc.)
- `modules/`: Component specific styles. (ex. modal.css, header.css, etc.)
- `pages/`: Entry files to transpile.

#### server
- `index.js`: Server script.
- `data/`: JSON files as storage of API.
- `views/`: Template files for server.
