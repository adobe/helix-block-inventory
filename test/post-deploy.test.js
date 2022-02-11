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
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { createTargets } from './post-deploy-utils.js';

chai.use(chaiHttp);
const { expect } = chai;

createTargets().forEach((target) => {
  describe(`Post-Deploy Tests (${target.title()})`, () => {
    it('Get 400 for empty prameters', async () => {
      await chai
        .request(target.host())
        .get(target.urlPath())
        .then((response) => {
          expect(response).to.have.status(400);
        }).catch((e) => {
          throw e;
        });
    }).timeout(50000);

    it('Get 200 for valid inventory', async () => {
      await chai
        .request(target.host())
        .get(`${target.urlPath()}?inventory=https://main--express-website--adobe.hlx.live/documentation/block-inventory`)
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
        }).catch((e) => {
          throw e;
        });
    }).timeout(50000);
  });
});
