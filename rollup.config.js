import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import json from "@rollup/plugin-json"

export default {
	input: `./src/index.ts`,
	output: {
		file: "./dist/index.js",
		format: "umd",
		sourcemap: true,
	},
	plugins: [
		typescript({
			tsconfig: "./tsconfig.json",
		}),
		resolve(),
		terser(),
		//commonjs(),
		json()
	], treeshake: { moduleSideEffects: false }
}
