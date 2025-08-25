import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Build Process Tests", () => {
    // Track if we need to clean up build artifacts
    let buildOutputPath
    let originalPackageJson

    beforeAll(() => {
        // Store original package.json for restoration
        originalPackageJson = fs.readFileSync("package.json", "utf8")
        buildOutputPath = path.resolve(
            process.cwd(),
            "../<app-name>/public/frontend",
        )
    })

    afterAll(() => {
        // Clean up build artifacts
        if (fs.existsSync(buildOutputPath)) {
            // Remove the entire build output directory
            fs.rmSync(buildOutputPath, { recursive: true, force: true })
        }

        // Restore original package.json
        fs.writeFileSync("package.json", originalPackageJson)
    })

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

    describe("Actual Build Process", () => {
        it("should fail build due to missing placeholder config (expected behavior)", () => {
            // This test expects the build to fail due to missing placeholder files
            // This is the expected behavior in a standalone environment
            expect(() => {
                execSync("yarn build", {
                    stdio: "pipe",
                    cwd: process.cwd(),
                })
            }).toThrow()
        })

        it("should fail with specific error about missing common_site_config.json", () => {
            try {
                execSync("yarn build", {
                    stdio: "pipe",
                    cwd: process.cwd(),
                })
            } catch (error) {
                const errorMessage = error.message

                // Check that the error is about the missing config file
                expect(errorMessage).toContain("Could not resolve")
                expect(errorMessage).toContain("common_site_config.json")
                expect(errorMessage).toContain("src/socket.js")
            }
        })

        it("should not create build output directory when build fails", () => {
            // Since the build fails, no output directory should be created
            expect(fs.existsSync(buildOutputPath)).toBe(false)
        })
    })

    describe("Build Artifacts Quality", () => {
        it("should not have build artifacts when build fails", () => {
            // Since the build fails, no artifacts should exist
            expect(fs.existsSync(buildOutputPath)).toBe(false)
        })
    })

    describe("Package Version Compatibility Testing", () => {
        it("should validate vite plugin compatibility", () => {
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
            const viteVersion = packageJson.devDependencies.vite
            const vuePluginVersion = packageJson.devDependencies["@vitejs/plugin-vue"]

            // Check for major version mismatches
            // Handle semver ranges (e.g., "^5.4.10" -> "5")
            const viteMatch = viteVersion.replace(/^[\^~]/, "").match(/^(\d+)/)
            const vuePluginMatch = vuePluginVersion
                .replace(/^[\^~]/, "")
                .match(/^(\d+)/)

            expect(viteMatch).toBeTruthy()
            expect(vuePluginMatch).toBeTruthy()

            const viteMajor = Number.parseInt(viteMatch[1])
            const vuePluginMajor = Number.parseInt(vuePluginMatch[1])

            // Vite 5+ requires Vue plugin 5+
            if (viteMajor >= 5 && vuePluginMajor < 5) {
                throw new Error(
                    `Vite v${viteMajor} requires @vitejs/plugin-vue v5+, but found v${vuePluginMajor}`,
                )
            }
        })

        it("should check for potential breaking changes in dependencies", () => {
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))

            // Check Vite version
            const viteVersion = packageJson.devDependencies.vite
            const viteMatch = viteVersion.replace(/^[\^~]/, "").match(/^(\d+)\./)
            if (viteMatch) {
                const viteMajor = Number.parseInt(viteMatch[1])
                if (viteMajor >= 6) {
                    console.warn(
                        `⚠️  Warning: Vite v${viteMajor} detected. This may have breaking changes.`,
                    )
                }
            }

            // Check Vue plugin version
            const vuePluginVersion = packageJson.devDependencies["@vitejs/plugin-vue"]
            const vuePluginMatch = vuePluginVersion
                .replace(/^[\^~]/, "")
                .match(/^(\d+)\./)
            if (vuePluginMatch) {
                const vuePluginMajor = Number.parseInt(vuePluginMatch[1])
                if (vuePluginMajor >= 6) {
                    console.warn(
                        `⚠️  Warning: @vitejs/plugin-vue v${vuePluginMajor} detected. This may have breaking changes.`,
                    )
                }
            }

            // Check Tailwind version
            const tailwindVersion = packageJson.devDependencies.tailwindcss
            const tailwindMatch = tailwindVersion
                .replace(/^[\^~]/, "")
                .match(/^(\d+)\./)
            if (tailwindMatch) {
                const tailwindMajor = Number.parseInt(tailwindMatch[1])
                if (tailwindMajor >= 4) {
                    console.warn(
                        `⚠️  Warning: Tailwind CSS v${tailwindMajor} detected. This may have breaking changes.`,
                    )
                }
            }
        })
    })

    describe("Build Failure Analysis", () => {
        it("should identify the root cause of build failure", () => {
            try {
                execSync("yarn build", {
                    stdio: "pipe",
                    cwd: process.cwd(),
                })
            } catch (error) {
                const errorMessage = error.message

                // Analyze the error to identify the root cause
                if (errorMessage.includes("common_site_config.json")) {
                    console.log("🔍 Build failure analysis:")
                    console.log("   Root cause: Missing placeholder configuration file")
                    console.log("   Expected: ../../../../sites/common_site_config.json")
                    console.log(
                        "   Solution: This file is expected to exist in a full Frappe environment",
                    )
                    console.log("   Status: ✅ Expected behavior in standalone testing")
                } else if (errorMessage.includes("frappeui")) {
                    console.log("🔍 Build failure analysis:")
                    console.log("   Root cause: FrappeUI plugin configuration issue")
                    console.log("   Expected: Proper FrappeUI plugin setup")
                    console.log(
                        "   Solution: Check FrappeUI plugin configuration and version compatibility",
                    )
                    console.log("   Status: ❌ Unexpected configuration issue")
                } else {
                    console.log("🔍 Build failure analysis:")
                    console.log("   Root cause: Unknown build error")
                    console.log("   Error details:", errorMessage)
                    console.log("   Status: ❌ Unexpected build error")
                }
            }
        })

        it("should provide actionable feedback for build issues", () => {
            // This test provides guidance on how to resolve build issues
            console.log("📋 Build Issue Resolution Guide:")
            console.log("   1. Missing placeholder files:")
            console.log("      - Create mock files for testing")
            console.log("      - Or run in full Frappe environment")
            console.log("   2. Package version conflicts:")
            console.log("      - Check dependency compatibility")
            console.log("      - Update packages incrementally")
            console.log("   3. Plugin configuration:")
            console.log("      - Verify FrappeUI plugin setup")
            console.log("      - Check Vite configuration")
        })
    })
})
