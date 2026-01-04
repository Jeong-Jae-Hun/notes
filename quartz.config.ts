import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "재훈의 공개 노트",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "ko-KR",
    baseUrl: "Jeong-Jae-Hun.github.io/notes",
    ignorePatterns: ["private", "_CONTEXT.md", "*.local.*"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Sans KR",
        body: "Noto Sans KR",
        code: "Fira Code",
      },
      colors: {
        lightMode: {
          light: "#fafafa",
          lightgray: "#e8e8e8",
          gray: "#9e9e9e",
          darkgray: "#424242",
          dark: "#212121",
          secondary: "#1976d2",
          tertiary: "#4caf50",
          highlight: "rgba(25, 118, 210, 0.12)",
          textHighlight: "#ffeb3b88",
        },
        darkMode: {
          light: "#1a1b26",
          lightgray: "#2a2b3d",
          gray: "#565f89",
          darkgray: "#c0caf5",
          dark: "#f8f8f2",
          secondary: "#7aa2f7",
          tertiary: "#9ece6a",
          highlight: "rgba(122, 162, 247, 0.18)",
          textHighlight: "#e0af6888",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
