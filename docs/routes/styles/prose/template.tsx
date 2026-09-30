import { Button } from "../../../../src/components/button.tsx";
import { CodeBlock } from "../../../../src/components/code-block.tsx";

const samplePreCode = `npm install @cloudensis/design-system
npm run dev`;

const sampleNotProse = `<article class="prose">
	<p>本文</p>
	<div class="not-prose">
		<ul>
			<li>prose のスタイルが効かない</li>
		</ul>
	</div>
</article>`;

export function Template() {
	return (
		<>
			<p>記事本文を囲む要素に .prose を付けます。</p>
			<article class="prose rounded-sm border border-default p-6">
				<p>
					この記事は <code>.prose</code> が扱う HTML
					タグを一通り並べたものです。本文の中では{" "}
					<strong>strong による強い強調</strong>や<em>em による強調</em>、
					<a href="#prose">a によるリンク</a>、
					<mark>mark によるハイライト</mark>、<small>small による注記</small>、
					<del>del で消した文</del>、<ins>ins で足した文</ins>、
					<s>s で無効になった文</s>
					をそのまま使えます。
				</p>
				<p>
					略語は <abbr title="Cascading Style Sheets">CSS</abbr>{" "}
					のように書けます。化学式は H<sub>2</sub>O、指数は E = mc
					<sup>2</sup>。 キー操作は <kbd>Ctrl</kbd> + <kbd>C</kbd>{" "}
					のように示します。
					<dfn>prose</dfn> は記事本文に付けるクラスの名前です。
					<br />
					br で改行した行です。
				</p>
				<h2>見出し</h2>
				<p>
					h1 から h6
					まで、サイズと余白が段階的に変わります。見出しは直前のブロックから離れ、
					続く本文とは近づきます。h1
					はページの見出しと重なるため、このサンプルには入れていません。
				</p>
				<h3>h3 の見出し</h3>
				<p>h3 に続く本文です。</p>
				<h4>h4 の見出し</h4>
				<p>h4 に続く本文です。</p>
				<h5>h5 の見出し</h5>
				<p>h5 に続く本文です。</p>
				<h6>h6 の見出し</h6>
				<p>h6 に続く本文です。</p>
				<h2>リスト</h2>
				<ul>
					<li>ul の項目です。</li>
					<li>
						入れ子にするとマーカーが disc → circle → square と変わります。
						<ul>
							<li>
								2 階層目の項目
								<ul>
									<li>3 階層目の項目</li>
								</ul>
							</li>
						</ul>
					</li>
					<li>項目の中には段落やコードも置けます。</li>
				</ul>
				<ol>
					<li>ol の項目です。</li>
					<li>
						入れ子にすると decimal → lower-alpha → lower-roman と変わります。
						<ol>
							<li>
								2 階層目の項目
								<ol>
									<li>3 階層目の項目</li>
								</ol>
							</li>
						</ol>
					</li>
					<li>3 つ目の項目</li>
				</ol>
				<h3>説明リスト</h3>
				<dl>
					<dt>トークン</dt>
					<dd>
						配色やタイポグラフィの値に名前を付けたものです。colors.css と
						typography.css の @theme で定義しています。
					</dd>
					<dt>prose</dt>
					<dd>記事本文に付けるクラスの名前です。</dd>
				</dl>
				<h2>引用</h2>
				<blockquote>
					<p>
						よいデザインは、できるだけ少ないデザインで成り立っている。
						本質的でないものをすべて取り除けば、本質が際立つ。
					</p>
					<p>
						— <cite>Dieter Rams</cite>
					</p>
				</blockquote>
				<p>
					文中の短い引用は <q>このように</q> 書きます。
				</p>
				<h2>コード</h2>
				<p>
					インラインのコードは <code>--text-color-default</code>{" "}
					のように表示されます。 コマンドの出力は <samp>done</samp>{" "}
					のように示します。
				</p>
				<p>
					pre と code を直に書いた場合は、ハイライトなしのコードブロックです。
				</p>
				<pre>
					<code>{samplePreCode}</code>
				</pre>
				<h2>表</h2>
				<table>
					<caption>エントリごとの内容</caption>
					<thead>
						<tr>
							<th>import</th>
							<th>内容</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>colors.css</td>
							<td>色のトークン</td>
						</tr>
						<tr>
							<td>typography.css</td>
							<td>書体と見出しのトークン</td>
						</tr>
						<tr>
							<td>base.css</td>
							<td>body の既定のスタイル</td>
						</tr>
						<tr>
							<td>prose.css</td>
							<td>記事本文用のスタイル</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td>計</td>
							<td>4 ファイル</td>
						</tr>
					</tfoot>
				</table>
				<h2>図版</h2>
				<figure>
					<img
						src="/logo.png"
						alt="cloudensis のロゴ"
						width="120"
						height="120"
					/>
					<figcaption>
						figure と figcaption。画像は max-width: 100% で枠に収まります。
					</figcaption>
				</figure>
				<h2>開閉</h2>
				<details>
					<summary>details と summary</summary>
					<p>
						開いたときだけ表示される本文です。中のブロックにも同じ余白が
						適用されます。
					</p>
				</details>
				<hr />
				<p>
					hr
					の下の段落です。区切り線の手前も、見出しと同じだけ余白を広げています。
				</p>
			</article>

			<h2 class="text-heading-2">not-prose</h2>
			<div class="prose">
				<p>
					.prose の中で、not-prose
					を付けた要素とその中には、記事用のスタイルが効きません。コンポーネントを記事の中に置くときなどに使います。
				</p>
				<p>
					not-prose を付けた要素が p や pre
					などのブロック要素なら、ほかのブロックと同じ前後の余白を受けます。CodeBlock
					もこれに当たります。div には余白が付かないので、必要なら mb-*
					などで付けてください。
				</p>
			</div>
			<article class="prose rounded-sm border border-default p-6">
				<p>ここは .prose のスタイルが効く段落です。</p>
				<div class="not-prose mb-5 flex flex-wrap gap-2">
					<Button size="sm">not-prose の中</Button>
					<ul>
						<li>このリストにはマーカーが付かない</li>
					</ul>
				</div>
				<p>
					この段落も .prose のスタイルが効きます。CodeBlock は not-prose
					を付けているので、記事の中に置いても prose の pre
					のスタイルを受けません。
				</p>
			</article>
			<CodeBlock lang="html">{sampleNotProse}</CodeBlock>
		</>
	);
}
