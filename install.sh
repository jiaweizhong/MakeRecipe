npm init
npm install webpack --save-dev
npm install jquery --save

# install globally npm install $package_name --global

# basic webpack bundle set-up
# webpack.config.js

# config package.json
# install webpack-cli
npm install webpack-cli --save-dev
# launch npm scripts
npm run dev
# launch npm build
# can set the npm build script in the package.json
npm run build
# install webpack dev server
npm install webpack-dev-server --save-dev
# reall ship package is dist
# src folder is only for dev purpose
# in webpack.config.js:
# devServer: {
#   contentBase: './dist'
# }

# run on the real devServer
npm run start

# install html webpack plugin
npm install html-webpack-plugin --save-dev

# install babel convert js back to ES5 compiler
npm install babel-core babel-preset-env babel-loader@7 --save-dev

# install babel-polyfill for Promise
npm install babel-polyfill --save

# install axios for AJAX API
npm install axios --save

# proxy URL as access prefix
https://crossorigin.me/ or https://cors-anywhere.herokuapp.com/

# install fractional.js
npm install fractional --save

# install uniqueid
npm install uniqid --save
