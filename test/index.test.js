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

/* eslint-env mocha */
import assert from 'assert';
import { Request, reset } from '@adobe/helix-fetch';
import { main } from '../src/index.js';

describe('Index Tests', () => {
  const context = {
    func: {
      package: 'helix-shared',
      name: 'block-inventory',
      version: 'local',
    },
  };

  it('index function is present', async () => {
    const result = await main(new Request('https://localhost/'), context);
    assert.strictEqual(await result.text(), 'Missing parameters inventory, [selector]');
  });

  it('index rejects non-helix URLs', async () => {
    const result = await main(new Request([
      'https://localhost/',
      '?inventory=https://www.example.com',
      '&selector=body',
    ].join('')), context);
    assert.equal(result.status, 400);
  }).timeout(15000);

  it('index function generates list from multiple inventories', async () => {
    const result = await main(new Request([
      'https://localhost/',
      '?inventory=https%3A%2F%2Fmain--express-website--adobe.hlx.live%2Fdocumentation%2Fblock-inventory',
      '&inventory=https%3A%2F%2Fmain--express-website--adobe.hlx.live%2Fdocumentation%2Fblock-inventory',
      '&domain=https://blog.adobe.com',
    ].join('')), context);
    assert.equal(result.status, 200);
    console.log(await result.json());
  }).timeout(15000);

  it('index function generates list from domain', async () => {
    const result = await main(new Request([
      'https://localhost/',
      '?domain=https://blog.adobe.com',
    ].join('')), context);
    assert.equal(result.status, 200);
    console.log(await result.json());
  }).timeout(15000);

  it.skip('index function generates screenshot from URL', async () => {
    const result = await main(new Request([
      'https://localhost/',
      '?selector=%23marquee-small+%7E+*%5Bdata-block-name%3D%22marquee--small-%22%5D',
      '&inventory=https%3A%2F%2Fmain--consonant--adobecom.hlx.live%2Fdocumentation%2Fblock-inventory',
    ].join('')), context);
    assert.equal(result.status, 200);
    console.log(await result.json());
  }).timeout(45000);

  after(() => reset);
});
