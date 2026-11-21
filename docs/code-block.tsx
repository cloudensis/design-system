import { createCodeBlock } from "../src/components/code-block.tsx";
import { highlight } from "../src/lib/bundled-highlight.ts";

/* ドキュメントサイトでは、同梱している言語をすべてハイライトする。 */
export const CodeBlock = createCodeBlock(highlight);
