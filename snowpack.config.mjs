/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: {
      url: "/",
      static: true
    },
    src: {
      url: "/"
    },
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-typescript"
  ],
  routes: [
  ],
  optimize: {
    bundle: true,
    minify: true,
    splitting: true,
    treeshake: true,
    manifest: true
  },
  packageOptions: {
  },
  devOptions: {
  },
  buildOptions: {
  },
};
