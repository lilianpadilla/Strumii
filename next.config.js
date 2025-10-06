const webpack = require("webpack");

module.exports = async () => {
  return {
    webpack: (config) => {
      config.resolve.alias.canvas = false;
      config.resolve.extensionAlias = {
        ".js": [".js", ".ts"],
      };
      return config;
    },
    experimental: {
      webpackMemoryOptimizations: true,     // Next 15+ lowers peak memory
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: { ignoreBuildErrors: true } // if your CI runs tsc separately
  }
}
