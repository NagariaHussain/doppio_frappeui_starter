import path from "node:path"
import vue from "@vitejs/plugin-vue"
import frappeui from "frappe-ui/vite"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		frappeui({
			frappeProxy: true,
			jinjaBootData: true,
			buildConfig: {
				indexHtmlPath: "../<app-name>/www/frontend.html",
			},
		}),
		vue(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"tailwind.config.js": path.resolve(__dirname, "tailwind.config.js"),
		},
	},
	optimizeDeps: {
		include: ["feather-icons", "showdown", "highlight.js/lib/core"],
	},
	server: {
		allowedHosts: true,
	},
})
