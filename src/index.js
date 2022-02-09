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
import { Response } from '@adobe/helix-fetch';
import getPreview from './preview.js';
import BlockList from './blocklist.js';

/**
 * This is the main function
 * @param {Request} request the request object (see fetch api)
 * @param {UniversalContext} context the context of the universal serverless function
 * @returns {Response} a response
 */
async function run(request, context) {
  const url = new URL(request.url);
  const inventory = url.searchParams.get('inventory');
  const selector = url.searchParams.get('selector');
  if (inventory && new URL(inventory).host.match(/\.hlx\.live%/)) {
    return new Error('Invalid URL, only *.hlx.live allowed', {
      statusCode: 400,
      headers: {
        'x-error': 'Unsupported host name',
      },
    });
  }
  // const filter = url.searchParams.get('filter');
  if (inventory && selector) {
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
        },
      });
    }
    context.log.error(message.message);
    return new Response(message.message, {
      status: error,
      headers: {
        'x-error': message.message,
      },
    });
  } else if (inventory) {
    const { blocks } = await (await new BlockList(inventory, request.url).fetch()).parse();
    return new Response(JSON.stringify(blocks), {
      headers: {
        'content-type': 'application/json',
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
