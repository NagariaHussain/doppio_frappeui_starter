import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Build Process Tests", () => {
    describe("Build Configuration Validation", () => {
        it("should use correct output directory from vite config", () => {
            const viteConfig = fs.readFileSync("vite.config.js", "utf8")
            const expectedOutputDir = "../<app-name>/public/frontend"

            expect(viteConfig).toContain(expectedOutputDir)
        })

        it("should have frappe-ui plugin configured", () => {
            const viteConfig = fs.readFileSync("vite.config.js", "utf8")

            expect(viteConfig).toContain("frappeui")
            expect(viteConfig).toContain("buildConfig")
        })

        it("should have vue plugin configured", () => {
            const viteConfig = fs.readFileSync("vite.config.js", "utf8")

            expect(viteConfig).toContain("@vitejs/plugin-vue")
            expect(viteConfig).toContain("vue()")
        })
    })

    describe("Build Dependencies", () => {
        it("should have required build dependencies", () => {
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

            expect(packageJson.devDependencies.vite).toBeDefined()
            expect(packageJson.devDependencies["@vitejs/plugin-vue"]).toBeDefined()
            expect(packageJson.devDependencies["@biomejs/biome"]).toBeDefined()
        })

        it("should have build script configured", () => {
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

            expect(packageJson.scripts.build).toBe("vite build")
        })
    })

    describe("Source Files for Build", () => {
        it("should have main entry point", () => {
            expect(fs.existsSync("src/main.js")).toBe(true)
        })

        it("should have index.html", () => {
            expect(fs.existsSync("index.html")).toBe(true)
        })

        it("should have all required Vue components", () => {
            const requiredComponents = [
                "src/App.vue",
                "src/pages/Home.vue",
                "src/pages/Login.vue",
            ]

            for (const component of requiredComponents) {
                expect(fs.existsSync(component)).toBe(true)
            }
        })

        it("should have router configuration", () => {
            expect(fs.existsSync("src/router.js")).toBe(true)
        })

        it("should have socket configuration", () => {
            expect(fs.existsSync("src/socket.js")).toBe(true)
        })
    })

    describe("Build Configuration Files", () => {
        it("should have valid vite configuration", () => {
            const viteConfig = fs.readFileSync("vite.config.js", "utf8")

            // Check for essential Vite configuration
            expect(viteConfig).toContain("export default")
            expect(viteConfig).toContain("plugins")
            expect(viteConfig).toContain("build")
        })

        it("should have valid tailwind configuration", () => {
            const tailwindConfig = fs.readFileSync("tailwind.config.js", "utf8")

            expect(tailwindConfig).toContain("export default")
            expect(tailwindConfig).toContain("content")
            expect(tailwindConfig).toContain("frappeUIPreset")
        })

        it("should have valid postcss configuration", () => {
            const postcssConfig = fs.readFileSync("postcss.config.js", "utf8")

            expect(postcssConfig).toContain("export default")
            expect(postcssConfig).toContain("plugins")
            expect(postcssConfig).toContain("tailwindcss")
        })
    })

    describe("Placeholder Path Configuration", () => {
        it("should have placeholder paths in vite config", () => {
            const viteConfig = fs.readFileSync("vite.config.js", "utf8")

            // Check that the placeholder paths are present
            expect(viteConfig).toContain("<app-name>")
            expect(viteConfig).toContain("public/frontend")
        })

        it("should have placeholder paths in frappe-ui config", () => {
            const viteConfig = fs.readFileSync("vite.config.js", "utf8")

            // Check frappe-ui build configuration
            expect(viteConfig).toContain("indexHtmlPath")
            expect(viteConfig).toContain("frontend.html")
        })
    })

    describe("Socket Module Configuration", () => {
        it("should reference placeholder config path", () => {
            const socketContent = fs.readFileSync("src/socket.js", "utf8")

            // Check that it references the placeholder path
            expect(socketContent).toContain(
                "../../../../sites/common_site_config.json",
            )
        })

        it("should have expected socket functions", () => {
            const socketContent = fs.readFileSync("src/socket.js", "utf8")

            expect(socketContent).toContain("export function initSocket")
            expect(socketContent).toContain("export function useSocket")
        })
    })

    describe("Build Readiness", () => {
        it("should have all required files for build process", () => {
            const requiredFiles = [
                "package.json",
                "vite.config.js",
                "tailwind.config.js",
                "postcss.config.js",
                "index.html",
                "src/main.js",
                "src/App.vue",
                "src/router.js",
                "src/socket.js",
            ]

            for (const file of requiredFiles) {
                expect(fs.existsSync(file)).toBe(true)
            }
        })

        it("should have valid import/export syntax in source files", () => {
            const sourceFiles = ["src/main.js", "src/router.js", "src/socket.js"]

            for (const file of sourceFiles) {
                const content = fs.readFileSync(file, "utf8")
                expect(content).toMatch(/import.*from/)
            }
        })
    })
})
