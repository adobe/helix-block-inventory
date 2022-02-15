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
import { fetch } from '@adobe/helix-fetch';
import { JSDOM } from 'jsdom';
import Block from './block.js';

export default class TopList {
  constructor(base, serviceurl) {
    this.original = new URL(base);
    this.base = new URL('https://helix-pages.anywhere.run/helix-services/run-query@v2/rum-sources');
    this.base.searchParams.set('interval', 7);
    this.base.searchParams.set('checkpoint', 'viewblock');
    this.base.searchParams.set('domain', this.original.hostname + this.original.pathname);
    this.serviceurl = serviceurl;
    this.pages = {};
  }

  async fetch() {
    const res = await fetch(this.base.href);
    if (res.ok) {
      this.body = await res.json();
      this.pages = await this.body.results.reduce(async (p, v) => {
        const r = await p;
        if (r[v.topurl]) {
          return r;
        }
        const base = new URL(v.topurl);
        base.pathname = `${base.pathname}.plain.html`;
        try {
        // eslint-disable-next-line no-param-reassign
          r[v.topurl] = await (await fetch(base.href)).text();
        } catch {
          // do nothing
        }
        return r;
      }, {});
      return this;
    }
    throw new Error(`unable to fetch inventory from ${this.base}: ${await res.text()}`);
  }

  parse() {
    this.data = this.body.results.map((entry) => {
      const enriched = entry;
      if (this.pages[entry.topurl]) {
        enriched.dom = new JSDOM(this.pages[entry.topurl]).window.document;
      }
      return enriched;
    });
    return this;
  }

  get blocks() {
    return this.data.map((e) => {
      const className = e.source.replace(/^\./, '');
      // wait
      const el = e.dom.querySelector(`div[class="${className}"]`);

      if (el) {
        const block = new Block(e.dom, el);
        return {
          name: className,
          variant: block.variant,
          example: el.outerHTML,
          table: block.table,
          preview: (() => {
            const u = new URL(this.serviceurl);
            u.searchParams.set('selector', `*[data-block-name="${className}"]`);
            u.searchParams.set('inventory', e.topurl);
            return u.href;
          })(),
          title: className.replace(/--.*$/, ''),
          selector: `*[data-block-name="${className}"]`,
          description: '',
        };
      } else {
        return {
          synthetic: true,
          className,
        };
      }
    }).filter((e) => e.synthetic !== true);
  }
}
