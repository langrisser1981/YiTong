import { describe, expect, it } from "vitest";
import { bundledLanguages, bundledLanguagesBase, bundledLanguagesAlias } from "./shiki-slim";

describe("shiki-slim", () => {
  it("all base languages resolve with { default } module shape", async () => {
    for (const [id, loader] of Object.entries(bundledLanguagesBase)) {
      const result = (await loader()) as { default: unknown[] };
      expect(result, `${id}: missing { default }`).toHaveProperty("default");
      expect(Array.isArray(result.default), `${id}: default is not an array`).toBe(true);
      expect(result.default.length, `${id}: default array is empty`).toBeGreaterThan(0);
    }
  });

  it("all aliases resolve with { default } module shape", async () => {
    for (const [alias, loader] of Object.entries(bundledLanguagesAlias)) {
      const result = (await loader()) as { default: unknown[] };
      expect(result, `${alias}: missing { default }`).toHaveProperty("default");
      expect(Array.isArray(result.default), `${alias}: default is not an array`).toBe(true);
    }
  });

  it("aliases resolve to the same grammar as their canonical id", async () => {
    const pairs: [string, string][] = [
      ["js", "javascript"],
      ["ts", "typescript"],
      ["py", "python"],
      ["rs", "rust"],
      ["rb", "ruby"],
      ["md", "markdown"],
      ["yml", "yaml"],
      ["objc", "objective-c"],
      ["shell", "shellscript"],
      ["bash", "shellscript"],
      ["protobuf", "proto"],
    ];

    for (const [alias, canonical] of pairs) {
      const aliasResult = (await bundledLanguages[alias]()) as { default: unknown[] };
      const canonicalResult = (await bundledLanguages[canonical]()) as { default: unknown[] };
      expect(aliasResult.default, `${alias} should resolve to same grammar as ${canonical}`).toBe(
        canonicalResult.default,
      );
    }
  });

  it("bundledLanguages merges base and alias entries", () => {
    const baseCount = Object.keys(bundledLanguagesBase).length;
    const aliasCount = Object.keys(bundledLanguagesAlias).length;
    const totalCount = Object.keys(bundledLanguages).length;
    expect(totalCount).toBe(baseCount + aliasCount);
  });
});
