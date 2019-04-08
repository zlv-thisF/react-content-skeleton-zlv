import htmlWebpackPlugin from "html-webpack-plugin";
import Server from "../server";

interface IOptions {
  [propName: string]: string;
}

const staticPath = "zlv";
const PLUGIN_NAME = "react-content-skeleton-plugin";

const addScriptTag = (source, src, port) => {
  const token = source.split("</body>");
  if (token.length < 2) return source;
  const scriptTag = `
    <script>
      window._pageSkeletonSocketPort = ${port}
    </script>
    <script type="text/javascript" src="${src}" defer></script>
    `;
  return `${token[0]}${scriptTag}</body>${token[1]}`;
};

class ContentSkeletonPlugin {
  private options: IOptions;

  public constructor(options: IOptions) {
    this.options = options;
    this.skeletonServer = null;
  }

  private runSkeletonServer() {
    this.skeletonServer = new Server(this.options);
  }

  private insertScriptToClient(htmlWebpackPluginData) {
    const { port } = this.options;
    const clientEntry = `http://localhost:${port}/${staticPath}/index.bundle.js`;
    const oldHtml = htmlWebpackPluginData.html;
    htmlWebpackPluginData.html = addScriptTag(oldHtml, clientEntry, port);
  }

  public apply(compiler) {
    if (compiler.hooks) {
      // webpack4+
      compiler.hooks.entryOption.tap(PLUGIN_NAME, () => {
        this.runSkeletonServer();
      });

      compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
        const htmlWebpackPluginBeforeHtmlProcessing =
          compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing ||
          htmlWebpackPlugin.getHooks(compilation).afterTemplateExecution;

        htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
          PLUGIN_NAME,
          (htmlWebpackPluginData, cb) => {
            this.insertScriptToClient(htmlWebpackPluginData);
            cb(null, htmlWebpackPluginData);
          }
        );

        const htmlWebpackPluginAfterHtmlProcessing =
          compilation.hooks.htmlWebpackPluginAfterHtmlProcessing ||
          htmlWebpackPlugin.getHooks(compilation).beforeEmit;

        htmlWebpackPluginAfterHtmlProcessing.tapAsync(
          PLUGIN_NAME,
          (htmlWebpackPluginData, cb) => {}
        );
      });
    } else {
      // webpack
    }
  }
}

export default ContentSkeletonPlugin;
