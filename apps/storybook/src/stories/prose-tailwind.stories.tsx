import type { Meta, StoryObj } from '@storybook/html-vite'
import { Prose } from '@cloudensis/ui'
import { story, withNote } from '../render'
import { DemoButton, DemoCallout } from '../components/demo-widgets'

/**
 * Coexistence with Tailwind (3.6).
 *
 * Turn the **Tailwind** toolbar on for these stories - with it off, the
 * utility classes below simply do not exist and nothing changes.
 */
const meta: Meta = {
  title: 'Prose/Tailwind',
  parameters: {
    docs: {
      description: {
        component: [
          'ツールバーの **Tailwind** を `on` にしてから見てください。`off` のときは、',
          'ここで使っているユーティリティクラスは存在しないので何も起きません。',
          '',
          'レイヤ順は `.storybook/preview-head.html` で固定しています。',
          '',
          '```css',
          '@layer theme, base, cds.tokens, cds.prose, cds.ui, components, utilities;',
          '```',
          '',
          'これが README に書く利用側の手順と同じ形です。放置すると import 順がそのまま優先順位になり、',
          'どちらの順でも壊れます（Tailwind が先なら `cds.prose` がユーティリティより強くなり、',
          'こちらが先なら Preflight が `cds.prose` より強くなる）。',
        ].join('\n'),
      },
    },
  },
}
export default meta

/**
 * With the layer order right, utilities still win inside `.prose` - so
 * `not-prose` is not needed for small adjustments.
 */
export const UtilitiesInsideProse: StoryObj = {
  render: () =>
    withNote(
      'レイヤ順が正しければ、.prose の内側でも Tailwind のユーティリティがそのまま効きます。小さな調整のために not-prose を使う必要はありません。',
      story(
        Prose({
          children: (
            <>
              <h2>ユーティリティによる調整</h2>
              <p>通常の段落。上下に 1.25em の余白があります。</p>
              <p class="mt-0 text-sm">
                <code>mt-0 text-sm</code> を当てた段落。`.prose :where(p)` は
                `cds.prose` レイヤ、ユーティリティは後続の `utilities` レイヤなので、
                詳細度に関係なくユーティリティが勝ちます。
              </p>
              <p>通常の段落に戻ります。</p>
            </>
          ),
        }),
      ),
    ),
}

/**
 * Layers beat specificity. `.cds-demo-callout__body p` is (0,2,1); `.text-sm`
 * is (0,1,0) and still wins - which `tailwind-merge` could never arrange,
 * because it is string manipulation and cannot know another element's
 * selectors (6.4).
 */
export const UtilitiesBeatSpecificity: StoryObj = {
  render: () =>
    withNote(
      '.cds-demo-callout__body p は (0,2,1)、.text-base は (0,1,0)。詳細度で負けていてもレイヤ順で勝ちます。tailwind-merge では解決できない種類の上書きです。',
      story(
        Prose({
          children: (
            <>
              <DemoCallout tone="info">
                <p>
                  既定。`.cds-demo-callout__body p` が font-size: 0.9375em を
                  指定しています。
                </p>
              </DemoCallout>
              <DemoCallout tone="info">
                <p class="text-base tracking-widest">
                  `text-base tracking-widest` を当てた段落。
                </p>
              </DemoCallout>
            </>
          ),
        }),
      ),
    ),
}

/** Every component takes `class`, and the utility wins (6.4). */
export const ComponentClassOverride: StoryObj = {
  render: () =>
    withNote(
      'すべてのコンポーネントが class prop を受け取り、cn() で自分のクラスの後ろに連結します。上書きの保証はレイヤ順です。',
      story(
        Prose({
          children: (
            <>
              <p>
                <DemoButton href="#">既定の Button</DemoButton>
              </p>
              <p>
                <DemoButton href="#" class="px-8 rounded-full">
                  px-8 rounded-full を当てた Button
                </DemoButton>
              </p>
            </>
          ),
        }),
      ),
    ),
}
