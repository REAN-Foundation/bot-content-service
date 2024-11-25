import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { faker } from '@faker-js/faker';
import { getTestData, setTestData } from '../init';
import { getRandomEnumValue } from '../utils';
import { PromptGroup } from '../../../src/domain.types/promptgroup.domain.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('03 - PromptGroup tests', function () {
    var agent = request.agent(infra._app);

    it('03:01 -> Create PromptGroup', function (done) {
        loadLlmPromptGroupCreateModel();
        const createModel = getTestData('LlmPromptGroupCreateModel');
        agent
            .post(`/api/v1/llmpromptgroups`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.id, 'LlmPromptGroupId_1');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                // expect(response.body.Data).to.have.property('PromptId');

                setTestData(response.body.Data.id, 'LlmPromptGroupId_1');
                expect(response.body.Data.Name).to.equal(getTestData('LlmPromptGroupCreateModel').Name);
                expect(response.body.Data.Description).to.equal(getTestData('LlmPromptGroupCreateModel').Description);
                // expect(response.body.Data.PromptId).to.equal(getTestData('LlmPromptVersionCreateModel').PromptId);
                
            })
            .expect(201, done);
    });

    it('03:02 -> Get promptgroup by id ', function (done) {
        agent
            .get(`/api/v1/llmpromptgroups/${getTestData('LlmPromptGroupId_1')}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
   
                expect(response.body.Data.Name).to.equal(getTestData('LlmPromptGroupCreateModel').Name);
                expect(response.body.Data.Description).to.equal(getTestData('LlmPromptGroupCreateModel').Description);
             
            })
            .expect(200, done);
    });

    it('02:03 -> Search prompt group records', function(done) {
        loadLlmPromptGroupQueryString();
        agent
            .get(`/api/v1/llmpromptgroups/search${loadLlmPromptGroupQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body.Data).to.have.property('TotalCount');
                expect(response.body.Data).to.have.property('RetrievedCount');
                expect(response.body.Data).to.have.property('PageIndex');
                expect(response.body.Data).to.have.property('ItemsPerPage');
                expect(response.body.Data).to.have.property('Order');
                expect(response.body.Data.TotalCount).to.greaterThan(0);
                expect(response.body.Data.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('03:04 -> Update PromptGroup', function (done) {
        loadLlmPromptGroupUpdateModel();
        const UpdateModel = getTestData('LlmPromptGroupUpdateModel');
        agent
            .put(`/api/v1/llmpromptgroups/${getTestData('LlmPromptGroupId_1')}`)
            .set('Content-Type', 'application/json')
            .send(UpdateModel)
            .expect((response) => {
                setTestData(response.body.Data.id, 'LlmPromptGroupId_1');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                // expect(response.body.Data).to.have.property('PromptId');

                // setTestData(response.body.Data.id, 'LlmPromptGroupId_1');
                expect(response.body.Data.Name).to.equal(getTestData('LlmPromptGroupUpdateModel').Name);
                expect(response.body.Data.Description).to.equal(getTestData('LlmPromptGroupUpdateModel').Description);
                // expect(response.body.Data.PromptId).to.equal(getTestData('LlmPromptVersionCreateModel').PromptId);
             
            })
            .expect(200, done);
    });
 
    it('03:05 -> Delete LlmPromptGroup', function(done) {
        
        agent
            .delete(`/api/v1/llmpromptgroups/${getTestData('LlmPromptGroupId_1')}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('03:06 -> Get All LlmPrompt group', function (done) {
        agent
            .get(`/api/v1/llmpromptgroups/records`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:08 -> Negative - Create  group', function(done) {
        loadNegativeLlmPromptGroupCreateModel();
        const createModel = getTestData("NegativeLlmPromptGroupCreateModel");
        agent
            .post(`/api/v1/llmpromptgroups/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
    
            })
            .expect(422, done);
    });

    it('06:07 -> Negative - Search prompt group records', function(done) {
        loadNegativePromptGroupQueryString();
        agent
            .get(`/api/v1/llmpromptgroups/search${loadNegativePromptGroupQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                // expect(response.body).to.not.have.property('Status');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('01:08 -> Negative - Delete prompt', function(done) {
        
        agent
            .delete(`/api/v1/llmpromptgroups/${getTestData('LlmPromptGroupId_1')}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

export const loadLlmPromptGroupCreateModel = async () => {
    const model = {
        Name        : getRandomEnumValue(PromptGroup),
        Description : faker.lorem.words(2),
        PromptId    : getTestData("LlmPromptId"),
    };
    setTestData(model, 'LlmPromptGroupCreateModel');
};

export const loadLlmPromptGroupUpdateModel = async () => {
    const model = {
        Name        : getRandomEnumValue(PromptGroup),
        Description : faker.lorem.words(2),
        // PromptId    : getTestData("LlmPromptId"),
    };
    setTestData(model, 'LlmPromptGroupUpdateModel');
};

function loadLlmPromptGroupQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeLlmPromptGroupCreateModel = async () => {
    const model = {
        Description : faker.lorem.words(2),
    };
    setTestData(model, 'NegativeLlmPromptGroupCreateModel');
};

function loadNegativePromptGroupQueryString() {
    const queryString = 'abc';
    return queryString;
}
