/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import wrap from '@adobe/helix-shared-wrap';
import { logger } from '@adobe/helix-universal-logger';
import { wrap as status } from '@adobe/helix-status';
import { Response, fetch } from '@adobe/helix-fetch';
import getPreview from './preview.js';
import BlockList from './blocklist.js';
import TopList from './toplist.js';

/**
 * This is the main function
 * @param {Request} request the request object (see fetch api)
 * @param {UniversalContext} context the context of the universal serverless function
 * @returns {Response} a response
 */
async function run(request, context) {
  const serviceurl = new URL(`https://helix-pages.anywhere.run/${context.func.package}/${context.func.name}@${context.func.version}`);
  const url = new URL(request.url);
  const inventory = url.searchParams.get('inventory');
  const inventories = url.searchParams.getAll('inventory');
  const selector = url.searchParams.get('selector');
  const domain = url.searchParams.get('domain');

  if (inventory && selector) {
    if (inventory && !new URL(inventory).host.match(/\.hlx\.live$/)) {
      // this is not a hlx.live URL, but it could be a valid production URL, checking
      const guessurl = new URL('https://helix-pages.anywhere.run/helix-services/run-query@v2/guess-hostname');
      guessurl.searchParams.set('domain', new URL(inventory).hostname);
      const guessreq = await fetch(guessurl.href);
      if (!guessreq.ok || (await guessreq.json()).results.length === 0) {
        return new Response('Invalid URL, only *.hlx.live allowed', {
          status: 400,
          headers: {
            'x-error': 'Unsupported host name',
          },
        });
      }
    }
    context.log.info(`Getting screenshot ${context.env.SCREENLY_KEY?.length}`);
    const { shot_url: location, error, message } = await getPreview(
      inventory,
      selector,
      { apikey: context.env.SCREENLY_KEY },
    );
    if (location) {
      return new Response('Your screenshot is ready', {
        status: 302,
        headers: {
          location,
          'cache-control': 'max-age: 3500', // screenly stores images for 60 minutes.
        },
      });
    }
    context.log.error(`Error ${error} from Screenly: ${message.message}`);
    return new Response(message.message, {
      status: error,
      headers: {
        'x-error': message.message,
      },
    });
  } else if (inventories.length || domain) {
    const allblocks = Object.entries(([
      (domain ? await (await new TopList(domain, serviceurl).fetch()).parse().blocks : []),
      ...await Promise.all(inventories.map(async (i) => {
        const { blocks } = await (await new BlockList(i, serviceurl).fetch()).parse();
        return blocks;
      }))])
      .reduce((p, b) => [...p, ...b], []) // flatten
      .reduce((p, v) => { // group by unique preview url
        const { name, preview } = v;
        // strip out variants (typically in brackets)
        const cleanname = name.replace(/--.*$/, '');
        if (typeof p[cleanname] === 'undefined') {
          // eslint-disable-next-line no-param-reassign
          p[cleanname] = {};
        }
        // eslint-disable-next-line no-param-reassign
        p[cleanname][preview] = v;
        return p;
      }, {})).reduce((p, [key, value]) => {
      // eslint-disable-next-line no-param-reassign
      p[key] = Object.values(value);
      return p;
    }, {});

    return new Response(JSON.stringify(allblocks), {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  return new Response('Missing parameters inventory, [selector]', { status: 400 });
}

// eslint-disable-next-line import/prefer-default-export
export const main = wrap(run)
  .with(status)
  .with(logger.trace)
  .with(logger);
