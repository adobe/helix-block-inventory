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

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getFullName(className) {
  const splits = className.split('--');
  const name = cap(splits.shift(0));
  const variant = splits.map((v) => cap(v.replace(/-$/, ''))).join(', ');
  return { name, variant };
}

export default class Block {
  constructor(doc, el) {
    this.el = el;
    this.doc = doc;
    this.fullName = getFullName(el.className);
  }

  get name() {
    return this.fullName.name;
  }

  get variant() {
    return this.fullName.variant;
  }

  get table() {
    const rows = [...this.el.children];
    const maxCols = rows.reduce((cols, row) => (
      row.children.length > cols ? row.children.length : cols), 0);
    const table = this.doc.createElement('table');
    const headerRow = this.doc.createElement('tr');
    const blockName = this.variant ? `${this.name} (${this.variant})` : this.name;
    headerRow.innerHTML = `<th colspan="${maxCols}">${blockName}</th>`;
    table.append(headerRow);
    rows.forEach((row) => {
      const tr = this.doc.createElement('tr');
      [...row.children].forEach((col) => {
        const td = this.doc.createElement('td');
        if (row.children.length < maxCols) {
          td.setAttribute('colspan', maxCols);
        }
        td.innerHTML = col.innerHTML;
        tr.append(td);
      });
      table.append(tr);
    });
    return table.outerHTML;
  }
}
