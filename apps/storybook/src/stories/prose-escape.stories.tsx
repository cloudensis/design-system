import type { Meta, StoryObj } from '@storybook/html-vite'
import { Prose } from '@cloudensis/ui'
import { story, withNote } from '../render'
import { DemoButton, DemoCallout } from '../components/demo-widgets'

/**
 * The two escape routes out of prose: `.not-prose` (5.3) and unlayered
 * application CSS (3.2). Both are acceptance criteria in section 10.
 */
const meta: Meta = {
  title: 'Prose/Escape hatches',
}
export default meta

const wrap = (children: unknown, note: string) =>
  withNote(note, story(Prose({ children: children as never })))

/** `.not-prose` switches prose off for an element and everything under it. */
export const NotProse: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '除外句 `:not(:where(.not-prose, .not-prose *))` はビルド時に全セレクタへ機械的に付与されます（5.3）。手書きでは必ず書き漏らしが出るためです。',
      },
    },
  },
  render: () =>
    wrap(
      <>
        <h2>.not-prose の外と内</h2>
        <p>この段落には prose が効いています。</p>
        <ul>
          <li>このリストにも効いています。</li>
        </ul>

        <div class="not-prose">
          <h2>.not-prose の中の h2</h2>
          <p>この段落には prose が効きません（ブラウザ既定のまま）。</p>
          <ul>
            <li>リストも既定のまま。</li>
          </ul>
          <a href="#">リンクの色も既定のまま。</a>
        </div>

        <p>ここから下は再び prose が効きます。</p>
      </>,
      '上下の段落と、.not-prose で囲んだブロックを見比べてください。ブロック直下だけでなく、子孫すべてで無効になります。',
    ),
}

/**
 * The layer contract: unlayered application CSS beats every layer, whatever
 * the specificity and whatever the import order (3.2).
 */
export const ConsumerOverride: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: [
          'アプリ側の CSS（`src/host.css` の `.app-override`）はレイヤ外にあるため、',
          '`cds.prose` / `cds.ui` のどのルールよりも強くなります。詳細度はクラス1つ (0,1,0) だけです。',
          '',
          'これが上書きの保証機構です。`:where()` はこの役割を担っていません（5.2）。',
          '`:where()` が担うのは `cds.prose` レイヤ**内部**での一貫性 —',
          '全ルールが (0,1,0) で揃っているので「後に書いた方が勝つ」だけで読めるということ — です。',
        ].join('\n'),
      },
    },
  },
  render: () =>
    wrap(
      <>
        <h2>レイヤ外 CSS による上書き</h2>
        <p>通常の段落。</p>
        <p class="app-override">
          .app-override をひとつ足しただけの段落。!important も詳細度の上乗せもなし。
        </p>
        <h3 class="app-override">見出しにも同じことが起きます</h3>
        <DemoButton href="#" class="app-override">
          cds.ui のコンポーネントにも効きます
        </DemoButton>
      </>,
      'レイヤの判定は詳細度より先に行われます。だからアプリ側はクラス1つで勝てます。',
    ),
}

/** Pattern A and pattern B side by side, inside `.prose` (6.5 / 7.3). */
export const ComponentsInsideProse: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: [
          '**パターン A**（`DemoCallout`）は本文を受け取ります。装飾部分にだけ `not-prose` を付け、',
          'children のスロットは開けておきます。根に `not-prose` を付けると中の本文まで prose から外れるため禁止です。',
          '',
          '**パターン B**（`DemoButton`）は本文を受け取りません。根に `not-prose` を付けて丸ごと隔離します。',
          '',
          'ダミーコンポーネントは `apps/storybook` 内にあり、`@cloudensis/ui` には入っていません。',
        ].join('\n'),
      },
    },
  },
  render: () =>
    wrap(
      <>
        <h2>.prose の内側に置いた UI コンポーネント</h2>
        <p>直前の段落。</p>

        <DemoCallout tone="info">
          <p>
            パターン A。この段落には prose が効きます。<code>code</code> も{' '}
            <a href="#">リンク</a> も本文と同じ見た目です。
          </p>
          <ul>
            <li>リストも同様。</li>
          </ul>
        </DemoCallout>

        <DemoCallout tone="danger">
          <p>トーン違い。トークンの状態色を参照しています。</p>
        </DemoCallout>

        <p>コンポーネントの上下の余白が、段落と揃っていること（5.4）。</p>

        <DemoButton href="#">パターン B。中には prose が効きません。</DemoButton>

        <p>直後の段落。</p>
      </>,
      '.prose 直下に置いた任意の要素は段落と同じ垂直リズムを受け取ります。記事側で余白調整を書く必要はありません。',
    ),
}
