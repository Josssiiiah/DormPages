				import worker, * as OTHER_EXPORTS from "/Users/josiah/Dev/gallery/.wrangler/tmp/pages-LNLBs8/functionsWorker-0.035656886067827465.mjs";
				import * as __MIDDLEWARE_0__ from "/Users/josiah/Dev/gallery/node_modules/.pnpm/wrangler@3.48.0_@cloudflare+workers-types@4.20240405.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts";
import * as __MIDDLEWARE_1__ from "/Users/josiah/Dev/gallery/node_modules/.pnpm/wrangler@3.48.0_@cloudflare+workers-types@4.20240405.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts";
				
				worker.middleware = [
					__MIDDLEWARE_0__.default,__MIDDLEWARE_1__.default,
					...(worker.middleware ?? []),
				].filter(Boolean);
				
				export * from "/Users/josiah/Dev/gallery/.wrangler/tmp/pages-LNLBs8/functionsWorker-0.035656886067827465.mjs";
				export default worker;