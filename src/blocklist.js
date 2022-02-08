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

function getPreviousHeading(el, className = el.className, otherchildren = []) {
  if (el.previousElementSibling && el.previousElementSibling.tagName.match(/^H[1-6]$/)) {
    return {
      heading: el.previousElementSibling.textContent,
      otherchildren,
      selector: `#${el.previousElementSibling.id} ~ *[data-block-name="${className}"]`,
    };
  } else if (el.previousElementSibling) {
    return getPreviousHeading(el.previousElementSibling, className, [...otherchildren, el]);
  }
  return { otherchildren };
}

export default class BlockList {
  constructor(base) {
    this.original = new URL(base);
    this.base = new URL(base);
    this.base.pathname = `${this.base.pathname}.plain.html`;
  }

  async fetch() {
    const res = await fetch(this.base);
    if (res.ok) {
      this.body = await res.text();
      return this;
    }
    throw new Error(`unable to fetch inventory from ${this.base}`);
  }

  parse() {
    this.dom = new JSDOM(this.body).window.document;
    return this;
  }

  get blocks() {
    return Array.from(this.dom.querySelectorAll('div[class]')).map((e) => ({
      name: e.className,
      example: e.outerHTML,
      title: getPreviousHeading(e).heading,
      selector: getPreviousHeading(e).selector,
      description: getPreviousHeading(e).otherchildren
        .filter((c) => c.tagName !== 'DIV' && !c.className)
        .map((c) => c.textContent).join('\n'),
    }));
  }
}
