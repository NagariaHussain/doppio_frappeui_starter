import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Project Integration Tests", () => {
	describe("File Structure", () => {
		it("should have required source files", () => {
			const requiredFiles = [
				"src/main.js",
				"src/App.vue",
				"src/router.js",
				"src/socket.js",
				"src/data/session.js",
				"src/data/user.js",
				"src/pages/Home.vue",
				"src/pages/Login.vue",
			]

			for (const file of requiredFiles) {
				const filePath = path.join(process.cwd(), file)
				expect(fs.existsSync(filePath)).toBe(true)
			}
		})

		it("should have required configuration files", () => {
			const requiredConfigs = [
				"package.json",
				"vite.config.js",
				"biome.json",
				"tailwind.config.js",
				"postcss.config.js",
			]

			for (const file of requiredConfigs) {
				const filePath = path.join(process.cwd(), file)
				expect(fs.existsSync(filePath)).toBe(true)
			}
		})
	})

	describe("Package.json", () => {
		it("should have required scripts", () => {
			const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

			expect(packageJson.scripts).toBeDefined()
			expect(packageJson.scripts.build).toBe("vite build")
			expect(packageJson.scripts.lint).toBe("biome check --write .")
			expect(packageJson.scripts.test).toBe("vitest")
			expect(packageJson.scripts["test:run"]).toBe("vitest run")
		})

		it("should have required dependencies", () => {
			const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

			expect(packageJson.dependencies).toBeDefined()
			expect(packageJson.dependencies.vue).toBeDefined()
			expect(packageJson.dependencies["vue-router"]).toBeDefined()
			expect(packageJson.dependencies["frappe-ui"]).toBeDefined()
		})

		it("should have required dev dependencies", () => {
			const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

			expect(packageJson.devDependencies).toBeDefined()
			expect(packageJson.devDependencies.vite).toBeDefined()
			expect(packageJson.devDependencies["@vitejs/plugin-vue"]).toBeDefined()
			expect(packageJson.devDependencies["@biomejs/biome"]).toBeDefined()
			expect(packageJson.devDependencies.vitest).toBeDefined()
		})
	})

	describe("Configuration Files", () => {
		it("should have valid biome configuration", () => {
			const biomeConfig = JSON.parse(fs.readFileSync("biome.json", "utf8"))

			expect(biomeConfig.linter).toBeDefined()
			expect(biomeConfig.formatter).toBeDefined()
			expect(biomeConfig.linter.enabled).toBe(true)
			expect(biomeConfig.formatter.enabled).toBe(true)
		})

		it("should have valid tailwind configuration", () => {
			const tailwindConfig = fs.readFileSync("tailwind.config.js", "utf8")
			expect(tailwindConfig).toContain("export default")
			expect(tailwindConfig).toContain("content")
		})

		it("should have valid postcss configuration", () => {
			const postcssConfig = fs.readFileSync("postcss.config.js", "utf8")
			expect(postcssConfig).toContain("export default")
			expect(postcssConfig).toContain("plugins")
		})
	})

	describe("Source Code Quality", () => {
		it("should have valid JavaScript syntax in main files", () => {
			const mainFiles = ["src/main.js", "src/router.js"]

			for (const file of mainFiles) {
				const filePath = path.join(process.cwd(), file)
				const content = fs.readFileSync(filePath, "utf8")

				// Basic syntax check - should not contain obvious syntax errors
				expect(content).toMatch(/import.*from/)
			}
		})

		it("should have valid Vue component structure", () => {
			const vueFiles = [
				"src/App.vue",
				"src/pages/Home.vue",
				"src/pages/Login.vue",
			]

			for (const file of vueFiles) {
				const filePath = path.join(process.cwd(), file)
				const content = fs.readFileSync(filePath, "utf8")

				// Basic Vue component structure check
				expect(content).toMatch(/<template>/)
				// Some components might not have script tags if they're simple
				expect(content).toMatch(/<\/template>/)
			}
		})
	})

	describe("Build Configuration", () => {
		it("should have vite configuration with frappe-ui plugin", () => {
			const viteConfig = fs.readFileSync("vite.config.js", "utf8")

			expect(viteConfig).toContain("frappeui")
			expect(viteConfig).toContain("@vitejs/plugin-vue")
			expect(viteConfig).toContain("outDir")
		})

		it("should have placeholder paths in build configuration", () => {
			const viteConfig = fs.readFileSync("vite.config.js", "utf8")

			// Check that the placeholder paths are present
			expect(viteConfig).toContain("<app-name>")
			expect(viteConfig).toContain("public/frontend")
		})
	})

	describe("Socket Module", () => {
		it("should have socket module with expected structure", () => {
			const socketContent = fs.readFileSync("src/socket.js", "utf8")

			// Check that the socket module has the expected imports and exports
			expect(socketContent).toContain('import { io } from "socket.io-client"')
			expect(socketContent).toContain("export function initSocket")
			expect(socketContent).toContain("export function useSocket")
		})

		it("should reference the placeholder config path", () => {
			const socketContent = fs.readFileSync("src/socket.js", "utf8")

			// Check that it references the placeholder path
			expect(socketContent).toContain(
				"../../../../sites/common_site_config.json",
			)
		})
	})
})
