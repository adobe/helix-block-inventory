/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-env mocha */
import assert from 'assert';
import { reset } from '@adobe/helix-fetch';
import getPreview from '../src/preview.js';

describe('Preview Tests (online)', () => {
  it('generate preview', async () => {
    const res = await getPreview(
      'https://main--express-website--adobe.hlx.live/documentation/block-inventory',
      '#link-list-to-be-reviewed ~ *[data-block-name="link-list"]',
      { apikey: process.env.SCREENLY_KEY },
    );
    assert.ok(res);
    assert.ok(res.shot_url);
  }).timeout(15000);

  after(() => reset);
});
