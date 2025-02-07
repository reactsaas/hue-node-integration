import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry point
  format: ['cjs', 'esm'],  // Output both CommonJS and ESModules
  dts: true,               // Generate type declarations
  sourcemap: true,         // Include source maps
  minify: true,            // Minify the output
  clean: true,             // Clean the output directory before building
  external: ['axios', 'dotenv', 'eventsource'] // Mark dependencies as external
});