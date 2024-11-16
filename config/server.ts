import path from "path";

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  admin: {
    watchIgnoreFiles: [
      path.resolve(__dirname, '../frontend/**'),
      path.resolve(__dirname, '../local_databases/**'),
    ]
  }
});
