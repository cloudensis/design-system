/*
 * ドキュメントサイトのセキュリティヘッダー。
 * Worker が返すレスポンスには middleware で、SSG した静的ファイルには scripts/ssg.mjs が書き出す _headers で付ける。
 * scripts/ssg.mjs が Node の型除去で読み込むため、型注釈以外の TypeScript の構文は使わない。
 */
const contentSecurityPolicy = [
	"default-src 'self'",
	/* CodeBlock のコピーボタンも含め、インラインのスクリプトは使わない。 */
	"script-src 'self'",
	/* CSS Modules を style 要素に、Shiki の色を style 属性に書き出すため。 */
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self'",
	"font-src 'self'",
	/* 開発時の Vite の HMR（同じオリジンの WebSocket）のため。 */
	"connect-src 'self'",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
].join("; ");

export const securityHeaders: Record<string, string> = {
	"Content-Security-Policy": contentSecurityPolicy,
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"X-Frame-Options": "DENY",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
