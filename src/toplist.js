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

export default class TopList {
  constructor(base, serviceurl) {
    this.original = new URL(base);
    this.base = new URL('https://helix-pages.anywhere.run/helix-services/run-query@v2/rum-sources');
    this.base.searchParams.set('interval', 7);
    this.base.searchParams.set('checkpoint', 'viewblock');
    this.base.searchParams.set('domain', this.original.hostname + this.original.pathname);
    this.serviceurl = serviceurl;
  }

  async fetch() {
    const res = await fetch(this.base.href);
    if (res.ok) {
      this.body = await res.json();
      return this;
    }
    throw new Error(`unable to fetch inventory from ${this.base}: ${await res.text()}`);
  }

  parse() {
    this.data = this.body.results;
    return this;
  }

  get blocks() {
    return this.data.map((e) => ({
      name: e.source.replace(/^\./, ''),
      variant: e.source.replace(/^\./, '').split('--').slice(1).map((vi) => vi.replace(/-$/, ''))
        .join(', '),
      example: undefined, // tbd
      preview: (() => {
        const u = new URL(this.serviceurl);
        u.searchParams.set('selector', `*[data-block-name="${e.source.replace(/^\./, '')}"]`);
        u.searchParams.set('inventory', e.topurl);
        return u.href;
      })(),
      title: e.source.replace(/^\./, '').replace(/--.*$/, ''),
      selector: `*[data-block-name="${e.source.replace(/^\./, '')}"]`,
      description: '',
    }));
  }
}
