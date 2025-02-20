import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/comments.inline"

type Options = {
  provider: "giscus"
  options: {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
    themeUrl?: string
    lightTheme?: string
    darkTheme?: string
    mapping?: "url" | "title" | "og:title" | "specific" | "number" | "pathname"
    strict?: boolean
    reactionsEnabled?: boolean
    inputPosition?: "top" | "bottom"
  }
}

function boolToStringBool(b: boolean): string {
  return b ? "1" : "0"
}

export default ((opts: Options) => {
  const Comments: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    // check if comments should be displayed according to frontmatter
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    return (
      <div
        className="giscus"
        data-repo="Grecil/digital-garden"
        data-repo-id="R_kgDON7IJyw"
        data-category="Announcements"
        data-category-id="DIC_kwDON7IJy84CnDcC"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-light-theme="noborder_light"
        data-dark-theme="noborder_dark"
        data-theme-url="https://giscus.app/themes"
        data-lang="en"
      >
        <script
          src="https://giscus.app/client.js"
          crossorigin="anonymous"
          async
        ></script>
      </div>
    )    
  }

  Comments.afterDOMLoaded = script

  return Comments
}) satisfies QuartzComponentConstructor<Options>
