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

export default async function getPreview(url, selector, { apikey }) {
  const apiurl = new URL('https://3.screeenly.com/api/v1/shots');
  const previewrequest = await fetch(apiurl.href, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apikey}`,
      accept: 'application/json',
    },
    body: {
      window_width: 414,
      window_height: 736, // iphone 8 plus
      device_scale_factor: 3,
      url,
      selector,
      delay: 5000,
    },
  });
  if (previewrequest.status === 201) {
    return (await previewrequest.json()).data;
  }
  return { error: previewrequest.status, message: await previewrequest.json() };
}
