/* eslint-disable */

const path = require('path');
const ts = require('typescript');

/**
 * Adds nestjs grapqhl plugin
 *
 * Someone else has done this, see:
 * https://github.com/nrwl/nx/issues/2147
 */
const addGraphqlPlugin = (config) => {
  const rule = config.module.rules.find((rule) => rule.loader === 'ts-loader');
  if (!rule) throw new Error('no ts-loader rule found');
  rule.options = {
    ...rule.options,
    getCustomTransformers: (program) => {
      return {
        before: [require('@nestjs/graphql/plugin').before({}, program)],
      };
    },
    transpileOnly: false, // Required because if true, plugin can't work properly
  };
};

/**
 * Extend the default Webpack configuration from nx / ng to add Nestjs' graphql plugin and disable transpileOnly option.
 * this webpack.config is used w/ node:build builder
 */
module.exports = (config, context) => {
  console.log('Loading additional plugins...');

  addGraphqlPlugin(config);

  return config;
};
