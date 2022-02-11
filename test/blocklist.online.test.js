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
import BlockList from '../src/blocklist.js';

describe('Blocklist Tests (online)', () => {
  it('BlockList fetches inventory', async () => {
    const list = await (await new BlockList('https://main--express-website--adobe.hlx.live/documentation/block-inventory', 'http://localhost').fetch()).parse();
    assert.ok(list);
    assert.deepStrictEqual(list.blocks.pop(), {
      name: 'link-list',
      variant: '',
      example: '<div class="link-list"><div><div><h3 id="explore-more-flyer-template">Explore More Flyer Template</h3><p><a href="https://www.stage.adobe.com/express/create#announcements">Announcements</a></p><p><a href="https://www.stage.adobe.com/express/create#banners">Banners</a></p><p><a href="https://www.stage.adobe.com/express/create#business-cards">Business Cards</a></p><p><a href="https://www.stage.adobe.com/express/create#calendars">Calendars</a></p><p><a href="https://www.stage.adobe.com/express/create#cards">Cards</a></p><p><a href="https://www.stage.adobe.com/express/create#certificates">Certificates</a></p><p><a href="https://www.stage.adobe.com/express/create#charts">Charts</a></p><p><a href="https://www.stage.adobe.com/express/create#covers">Covers</a></p><p><a href="https://www.stage.adobe.com/express/create#flyers">Flyers</a></p><p><a href="https://www.stage.adobe.com/express/create#invitations">Invitations</a></p><p><a href="https://www.stage.adobe.com/express/create#logos">Logos</a></p><p><a href="https://www.stage.adobe.com/express/create#memes">Memes</a></p><p><a href="https://www.stage.adobe.com/express/create#menus">Menus</a></p><p><a href="https://www.stage.adobe.com/express/create#photo-collages">Photo Collages</a></p><p><a href="https://www.stage.adobe.com/express/create#planners">Planners</a></p><p><a href="https://www.stage.adobe.com/express/create#postcards">Postcards</a></p><p><a href="https://www.stage.adobe.com/express/create#posters">Posters</a></p><p><a href="https://www.stage.adobe.com/express/create#resumes">Resumes</a></p><p><a href="https://www.stage.adobe.com/express/create#tags">Tags</a></p><p><a href="https://www.stage.adobe.com/express/create#worksheet">Worksheet</a></p><p><a href="https://www.stage.adobe.com/express/create#everything-else">Everything Else</a></p></div></div></div>',
      table: '<table><tr><th colspan="1">Link-list</th></tr><tr><td><h3 id="explore-more-flyer-template">Explore More Flyer Template</h3><p><a href="https://www.stage.adobe.com/express/create#announcements">Announcements</a></p><p><a href="https://www.stage.adobe.com/express/create#banners">Banners</a></p><p><a href="https://www.stage.adobe.com/express/create#business-cards">Business Cards</a></p><p><a href="https://www.stage.adobe.com/express/create#calendars">Calendars</a></p><p><a href="https://www.stage.adobe.com/express/create#cards">Cards</a></p><p><a href="https://www.stage.adobe.com/express/create#certificates">Certificates</a></p><p><a href="https://www.stage.adobe.com/express/create#charts">Charts</a></p><p><a href="https://www.stage.adobe.com/express/create#covers">Covers</a></p><p><a href="https://www.stage.adobe.com/express/create#flyers">Flyers</a></p><p><a href="https://www.stage.adobe.com/express/create#invitations">Invitations</a></p><p><a href="https://www.stage.adobe.com/express/create#logos">Logos</a></p><p><a href="https://www.stage.adobe.com/express/create#memes">Memes</a></p><p><a href="https://www.stage.adobe.com/express/create#menus">Menus</a></p><p><a href="https://www.stage.adobe.com/express/create#photo-collages">Photo Collages</a></p><p><a href="https://www.stage.adobe.com/express/create#planners">Planners</a></p><p><a href="https://www.stage.adobe.com/express/create#postcards">Postcards</a></p><p><a href="https://www.stage.adobe.com/express/create#posters">Posters</a></p><p><a href="https://www.stage.adobe.com/express/create#resumes">Resumes</a></p><p><a href="https://www.stage.adobe.com/express/create#tags">Tags</a></p><p><a href="https://www.stage.adobe.com/express/create#worksheet">Worksheet</a></p><p><a href="https://www.stage.adobe.com/express/create#everything-else">Everything Else</a></p></td></tr></table>',
      title: 'Link List (to be reviewed)',
      selector: '#link-list-to-be-reviewed ~ *[data-block-name="link-list"]',
      preview: 'http://localhost/?selector=%23link-list-to-be-reviewed+%7E+*%5Bdata-block-name%3D%22link-list%22%5D&inventory=https%3A%2F%2Fmain--express-website--adobe.hlx.live%2Fdocumentation%2Fblock-inventory',
      description: '',
    });
  }).timeout(30000);

  after(() => reset);
});
