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
import { getPreviousHeading } from './collect-context.js';

export default class BlockList {
  constructor(base, serviceurl) {
    this.original = new URL(base);
    this.base = new URL(base);
    this.base.pathname = `${this.base.pathname}.plain.html`;
    this.serviceurl = serviceurl;
  }

  async fetch() {
    const res = await fetch(this.base);
    if (res.ok) {
      this.body = await res.text();
      return this;
    }
    throw new Error(`unable to fetch inventory from ${this.base}: ${await res.text()}`);
  }

  parse() {
    this.dom = new JSDOM(this.body).window.document;
    return this;
  }

  get blocks() {
    return Array.from(this.dom.querySelectorAll('div[class]')).map((e) => {
      const { heading, selector, otherchildren } = getPreviousHeading(e);
      const block = new Block(this.dom, e);
      return {
        name: e.className,
        variant: block.variant,
        example: e.outerHTML,
        table: block.table,
        preview: (() => {
          const u = new URL(this.serviceurl);
          u.searchParams.set('selector', selector);
          u.searchParams.set('inventory', this.original);
          return u.href;
        })(),
        title: heading,
        selector,
        description: otherchildren
          .filter((c) => c.tagName !== 'DIV' && !c.className)
          .map((c) => c.textContent).join('\n'),
      };
    });
  }
}
