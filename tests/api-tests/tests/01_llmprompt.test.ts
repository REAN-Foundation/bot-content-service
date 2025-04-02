import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { faker } from '@faker-js/faker';
import { getTestData, setTestData } from '../init';
import { PromptUsecase } from '../../../src/domain.types/usecase.domain.types';
import { getRandomEnumValue } from '../utils';
import { PromptGroup } from '../../../src/domain.types/promptgroup.domain.types';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('01 - Prompt tests', function () {
    var agent = request.agent(infra._app);

    it('01:01 -> Create Prompt', function (done) {
        loadLlmPromptCreateModel();
        const createModel = getTestData('LlmPromptCreateModel');
        agent
            .post(`/api/v1/llmprompts/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.id, 'LlmPromptId_1');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('UseCaseType');
                expect(response.body.Data).to.have.property('GroupName');
                expect(response.body.Data).to.have.property('ModelName');
                expect(response.body.Data).to.have.property('ModelVersion');
                expect(response.body.Data).to.have.property('UserId');
                expect(response.body.Data).to.have.property('Temperature');
                expect(response.body.Data).to.have.property('FrequencyPenality');
                expect(response.body.Data).to.have.property('TopP');
                expect(response.body.Data).to.have.property('PresencePenalty');
                expect(response.body.Data).to.have.property('IsActive');

                setTestData(response.body.Data.id, 'LlmPromptId_1');
                
                expect(response.body.Data.Name).to.equal(getTestData('LlmPromptCreateModel').Name);
                expect(response.body.Data.Description).to.equal(getTestData('LlmPromptCreateModel').Description);
                expect(response.body.Data.UseCaseType).to.equal(getTestData('LlmPromptCreateModel').UseCaseType);
                expect(response.body.Data.GroupName).to.equal(getTestData('LlmPromptCreateModel').GroupName);
                expect(response.body.Data.ModelName).to.equal(getTestData('LlmPromptCreateModel').ModelName);
                expect(response.body.Data.ModelVersion).to.equal(getTestData('LlmPromptCreateModel').ModelVersion);
                expect(response.body.Data.UserId).to.equal(getTestData('LlmPromptCreateModel').UserId);
                expect(response.body.Data.Temperature).to.equal(getTestData('LlmPromptCreateModel').Temperature);
                expect(response.body.Data.FrequencyPenality).to.equal(getTestData('LlmPromptCreateModel').FrequencyPenality);
                expect(response.body.Data.TopP).to.equal(getTestData('LlmPromptCreateModel').TopP);
                expect(response.body.Data.PresencePenalty).to.equal(getTestData('LlmPromptCreateModel').PresencePenalty);
                expect(response.body.Data.IsActive).to.equal(getTestData('LlmPromptCreateModel').IsActive);
            })
            .expect(201, done);
    });

    it('01:02 -> GetById LlmPrompt', function(done) {
        agent
            .get(`/api/v1/llmprompts/${getTestData('LlmPromptId_1')}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('UseCaseType');
                expect(response.body.Data).to.have.property('GroupName');
                expect(response.body.Data).to.have.property('ModelName');
                expect(response.body.Data).to.have.property('ModelVersion');
                expect(response.body.Data).to.have.property('UserId');
                expect(response.body.Data).to.have.property('Temperature');
                expect(response.body.Data).to.have.property('FrequencyPenality');
                expect(response.body.Data).to.have.property('TopP');
                expect(response.body.Data).to.have.property('PresencePenalty');
                expect(response.body.Data).to.have.property('IsActive');

                expect(response.body.Data.Name).to.equal(getTestData('LlmPromptCreateModel').Name);
                expect(response.body.Data.Description).to.equal(getTestData('LlmPromptCreateModel').Description);
                expect(response.body.Data.UseCaseType).to.equal(getTestData('LlmPromptCreateModel').UseCaseType);
                expect(response.body.Data.GroupName).to.equal(getTestData('LlmPromptCreateModel').GroupName);
                expect(response.body.Data.ModelName).to.equal(getTestData('LlmPromptCreateModel').ModelName);
                expect(response.body.Data.ModelVersion).to.equal(getTestData('LlmPromptCreateModel').ModelVersion);
                expect(response.body.Data.UserId).to.equal(getTestData('LlmPromptCreateModel').UserId);
                expect(response.body.Data.Temperature).to.equal(getTestData('LlmPromptCreateModel').Temperature);
                expect(response.body.Data.FrequencyPenality).to.equal(getTestData('LlmPromptCreateModel').FrequencyPenality);
                expect(response.body.Data.TopP).to.equal(getTestData('LlmPromptCreateModel').TopP);
                expect(response.body.Data.PresencePenalty).to.equal(getTestData('LlmPromptCreateModel').PresencePenalty);
                expect(response.body.Data.IsActive).to.equal(getTestData('LlmPromptCreateModel').IsActive);

            })
            .expect(200, done);
    });

    it('01:03 -> Search prompt records', function(done) {
        loadLlmPromptQueryString();
        agent
            .get(`/api/v1/llmprompts/search${loadLlmPromptQueryString()}`)
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

    it('01:04 -> Update LlmPrompt', function(done) {
        loadLlmPromptUpdateModel();
        const updateModel = getTestData("LlmPromptUpdateModel");
        agent
            .put(`/api/v1/llmprompts/${getTestData('LlmPromptId_1')}`)
            .set('Content-Type', 'application/json')
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('UseCaseType');
                expect(response.body.Data).to.have.property('GroupName');
                expect(response.body.Data).to.have.property('ModelName');
                expect(response.body.Data).to.have.property('ModelVersion');
                expect(response.body.Data).to.have.property('UserId');
                expect(response.body.Data).to.have.property('Temperature');
                expect(response.body.Data).to.have.property('FrequencyPenality');
                expect(response.body.Data).to.have.property('TopP');
                expect(response.body.Data).to.have.property('PresencePenalty');
                expect(response.body.Data).to.have.property('IsActive');

                expect(response.body.Data.Name).to.equal(getTestData('LlmPromptUpdateModel').Name);
                expect(response.body.Data.Description).to.equal(getTestData('LlmPromptUpdateModel').Description);
                expect(response.body.Data.UseCaseType).to.equal(getTestData('LlmPromptUpdateModel').UseCaseType);
                expect(response.body.Data.GroupName).to.equal(getTestData('LlmPromptUpdateModel').GroupName);
                expect(response.body.Data.ModelName).to.equal(getTestData('LlmPromptUpdateModel').ModelName);
                expect(response.body.Data.ModelVersion).to.equal(getTestData('LlmPromptUpdateModel').ModelVersion);
                expect(response.body.Data.UserId).to.equal(getTestData('LlmPromptUpdateModel').UserId);
                expect(response.body.Data.Temperature).to.equal(getTestData('LlmPromptUpdateModel').Temperature);
                expect(response.body.Data.FrequencyPenality).to.equal(getTestData('LlmPromptUpdateModel').FrequencyPenality);
                expect(response.body.Data.TopP).to.equal(getTestData('LlmPromptUpdateModel').TopP);
                expect(response.body.Data.PresencePenalty).to.equal(getTestData('LlmPromptUpdateModel').PresencePenalty);
                expect(response.body.Data.IsActive).to.equal(getTestData('LlmPromptUpdateModel').IsActive);

            })
            .expect(200, done);
    });

    it('01:05 -> Delete LlmPrompt', function(done) {
        
        agent
            .delete(`/api/v1/llmprompts/${getTestData('LlmPromptId_1')}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:06 -> Get All LlmPrompt', function (done) {
        agent
            .get(`/api/v1/llmprompts/records`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:07 -> Create Promptcreateagain', function (done) {
        loadLlmPromptCreateModel();
        const createModel = getTestData('LlmPromptCreateModel');
        agent
            .post(`/api/v1/llmprompts/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.id, 'LlmPromptId');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('UseCaseType');
                expect(response.body.Data).to.have.property('GroupName');
                expect(response.body.Data).to.have.property('ModelName');
                expect(response.body.Data).to.have.property('ModelVersion');
                expect(response.body.Data).to.have.property('UserId');
                expect(response.body.Data).to.have.property('Temperature');
                expect(response.body.Data).to.have.property('FrequencyPenality');
                expect(response.body.Data).to.have.property('TopP');
                expect(response.body.Data).to.have.property('PresencePenalty');
                expect(response.body.Data).to.have.property('IsActive');

                setTestData(response.body.Data.id, 'LlmPromptId');
                
                expect(response.body.Data.Name).to.equal(getTestData('LlmPromptCreateModel').Name);
                expect(response.body.Data.Description).to.equal(getTestData('LlmPromptCreateModel').Description);
                expect(response.body.Data.UseCaseType).to.equal(getTestData('LlmPromptCreateModel').UseCaseType);
                expect(response.body.Data.GroupName).to.equal(getTestData('LlmPromptCreateModel').GroupName);
                expect(response.body.Data.ModelName).to.equal(getTestData('LlmPromptCreateModel').ModelName);
                expect(response.body.Data.ModelVersion).to.equal(getTestData('LlmPromptCreateModel').ModelVersion);
                expect(response.body.Data.UserId).to.equal(getTestData('LlmPromptCreateModel').UserId);
                expect(response.body.Data.Temperature).to.equal(getTestData('LlmPromptCreateModel').Temperature);
                expect(response.body.Data.FrequencyPenality).to.equal(getTestData('LlmPromptCreateModel').FrequencyPenality);
                expect(response.body.Data.TopP).to.equal(getTestData('LlmPromptCreateModel').TopP);
                expect(response.body.Data.PresencePenalty).to.equal(getTestData('LlmPromptCreateModel').PresencePenalty);
                expect(response.body.Data.IsActive).to.equal(getTestData('LlmPromptCreateModel').IsActive);
            })
            .expect(201, done);
    });

    it('01:08 -> Negative - Create llmprompt', function(done) {
        loadNegativeLlmPromptCreateModel();
        const createModel = getTestData("NegativeLlmPromptCreateModel");
        agent
            .post(`/api/v1/llmprompts/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
    
            })
            .expect(422, done);
    });

    it('06:07 -> Negative - Search prompt records', function(done) {
        loadNegativeLlmPromptQueryString();
        agent
            .get(`/api/v1/llmprompts/search${loadNegativeLlmPromptQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('01:08 -> Negative - Delete prompt', function(done) {
        
        agent
            .delete(`/api/v1/llmprompts/${getTestData('LlmPromptId_1')}`)
            .set('Content-Type', 'application/json')
            .expect(response => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

});

export const loadLlmPromptCreateModel = async () => {
    const model = {
        Name              : faker.person.fullName(),
        Description       : faker.lorem.words(10),
        UseCaseType       : getRandomEnumValue(PromptUsecase),
        GroupName         : getRandomEnumValue(PromptGroup),
        ModelName         : faker.lorem.words(2),
        ModelVersion      : faker.lorem.words(1),
        UserId            : faker.lorem.words(10),
        Temperature       : faker.number.int({ max: 10 }),
        FrequencyPenality : faker.number.int({ max: 10 }),
        TopP              : faker.number.int({ max: 10 }),
        PresencePenalty   : faker.number.int({ max: 10 }),
        IsActive          : faker.datatype.boolean(),
    };
    setTestData(model, 'LlmPromptCreateModel');
};

export const loadLlmPromptUpdateModel = async () => {
    const model = {
        Name              : faker.person.fullName(),
        Description       : faker.lorem.words(10),
        UseCaseType       : getRandomEnumValue(PromptUsecase),
        GroupName         : getRandomEnumValue(PromptGroup),
        ModelName         : faker.lorem.words(2),
        ModelVersion      : faker.lorem.words(1),
        UserId            : faker.lorem.words(10),
        Temperature       : faker.number.float(),
        FrequencyPenality : faker.number.float(),
        TopP              : faker.number.float(),
        PresencePenalty   : faker.number.float(),
        IsActive          : faker.datatype.boolean(),
    };
    setTestData(model, 'LlmPromptUpdateModel');
};

function loadLlmPromptQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '';
    return queryString;
}

export const loadNegativeLlmPromptCreateModel = async () => {
    const model = {
        ModelName    : faker.lorem.words(2),
        ModelVersion : faker.lorem.words(1),
        IsActive     : faker.datatype.boolean(),
    };
    setTestData(model, 'NegativeLlmPromptCreateModel');
};

function loadNegativeLlmPromptQueryString() {
    const queryString = 'abc';
    return queryString;
}
