import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('04 - Qna Document Library tests', function () {
    var agent = request.agent(infra._app);

    it('04:01 - Create qna document library record', function (done) {
        loadQnaDocumentLibraryCreateModel();
        const createModel = getTestData('QnaDocumentLibraryCreateModel');
        agent
            .post(`/api/v1/documentlibrarys`)
            .set('Content-Type', 'application/json')

            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.id, 'QnaDocumentLibraryId_1');

                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('DocumentId');

                setTestData(response.body.Data.id, 'QnaDocumentLibraryId_1');

                expect(response.body.Data.DocumentId).to.equal(getTestData('QnaDocumentLibraryCreateModel').DocumentId);
            })
            .expect(201, done);
    });

    it('04:02 - Get qna document library by id', function (done) {
        agent
            .get(`/api/v1/documentlibrarys/${getTestData('QnaDocumentLibraryId_1')}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('DocumentId');

                expect(response.body.Data.DocumentId).to.equal(getTestData('QnaDocumentLibraryCreateModel').DocumentId);
            })

            .expect(200, done);
    });

    it('04:03 - Get all qna document library ', function (done) {
        agent
            .get(`/api/v1/documentlibrarys/all/`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })

            .expect(200, done);
    });

    it('04:04 - Update qna document library ', function (done) {
        loadQnaDocumentLibraryUpdateModel();
        const updateModel = getTestData('QnaDocumentLibraryUpdateModel');
        agent
            .put(`/api/v1/documentlibrarys/${getTestData('QnaDocumentLibraryId_1')}`)
            .set('Content-Type', 'application/json')

            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('DocumentId');

                expect(response.body.Data.DocumentId).to.equal(getTestData('QnaDocumentLibraryUpdateModel').DocumentId);
            })
            .expect(200, done);
    });

    it('04:05 - Delete qna document library', function (done) {
        agent
            .delete(`/api/v1/documentlibrarys/${getTestData('QnaDocumentLibraryId_1')}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('04:06 -> Negative - Create qna document library', function (done) {
        loadNegativeQnaDocumentLibraryCreateModel();
        const createModel = getTestData('NegativeQnaDocumentLibraryCreateModel');
        agent
            .post(`/api/v1/documentlibrarys`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('04:07 -> Negative - Get qna document library by id', function (done) {
        agent
            .get(`/api/v1/documentlibrarys/${getTestData('QnaDocumentLibraryId_1')}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('04:08 -> Negative - Delete qna document library', function (done) {
        agent
            .delete(`/api/v1/documentlibrarys/${getTestData('QnaDocumentLibraryId_1')}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

export const loadQnaDocumentLibraryCreateModel = async () => {
    const model = {
        DocumentId : faker.string.uuid(),
    };

    setTestData(model, 'QnaDocumentLibraryCreateModel');
};

export const loadQnaDocumentLibraryUpdateModel = async () => {
    const model = {
        DocumentId : faker.string.uuid(),
    };
    setTestData(model, 'QnaDocumentLibraryUpdateModel');
};

export const loadNegativeQnaDocumentLibraryCreateModel = async () => {
    const model = {
        DocumentId : faker.number.int({ min: 10, max: 100 }),
    };
    setTestData(model, 'NegativeQnaDocumentLibraryCreateModel');
};
