
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";

export default defineConfig({
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
  },
  integrations: [
    mermaid({
      theme: "base",
      mermaidConfig: {
        themeVariables: {
          background: "#f9fafb",
          primaryColor: "#e2e8f0",
          primaryTextColor: "#0f172a",
          secondaryColor: "#cbd5e1",
          tertiaryColor: "#94a3b8",
          lineColor: "#334155",
          noteBkgColor: "#e2e8f0",
          noteTextColor: "#0f172a",
        },
      },
    }),
  ],
});
