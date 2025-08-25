import path from "node:path"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./tests/setup.js"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"tests/",
				"**/*.config.js",
				"**/*.config.ts",
				"dist/",
				"../<app-name>/**",
			],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
})
