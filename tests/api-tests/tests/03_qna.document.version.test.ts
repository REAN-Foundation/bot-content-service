import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';
import { faker } from '@faker-js/faker';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('03 - Qna Document Version tests', function () {
    var agent = request.agent(infra._app);

    it('03:01 - Create qna document version record', function (done) {
        loadQnaDocumentVersionCreateModel();
        const createModel = getTestData('QnaDocumentVersionCreateModel');
        agent
            .post(`/api/v1/documentversions`)
            .set('Content-Type', 'application/json')

            .send(createModel)
            .expect((response) => {
                setTestData(response.body.Data.id, 'QnaDocumentVersionId_1');

                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('VersionNumber');
                expect(response.body.Data).to.have.property('StorageUrl');
                expect(response.body.Data).to.have.property('DownloadUrl');
                expect(response.body.Data).to.have.property('FileResourceId');
                expect(response.body.Data).to.have.property('Keywords');

                setTestData(response.body.Data.id, 'QnaDocumentVersionId_1');

                expect(response.body.Data.VersionNumber).to.equal(
                    getTestData('QnaDocumentVersionCreateModel').VersionNumber
                );
                expect(response.body.Data.StorageUrl).to.equal(getTestData('QnaDocumentVersionCreateModel').StorageUrl);
                expect(response.body.Data.DownloadUrl).to.equal(
                    getTestData('QnaDocumentVersionCreateModel').DownloadUrl
                );
                expect(response.body.Data.FileResourceId).to.equal(
                    getTestData('QnaDocumentVersionCreateModel').FileResourceId
                );

                expect(response.body.Data.Keywords).to.deep.equal(
                    getTestData('QnaDocumentVersionCreateModel').Keywords
                );
            })
            .expect(201, done);
    });

    it('03:02 - Get qna document version by id', function (done) {
        agent
            .get(`/api/v1/documentversions/${getTestData('QnaDocumentVersionId_1')}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('VersionNumber');
                expect(response.body.Data).to.have.property('StorageUrl');
                expect(response.body.Data).to.have.property('DownloadUrl');
                expect(response.body.Data).to.have.property('FileResourceId');
                expect(response.body.Data).to.have.property('Keywords');

                expect(response.body.Data.VersionNumber).to.equal(
                    getTestData('QnaDocumentVersionCreateModel').VersionNumber
                );
                expect(response.body.Data.StorageUrl).to.equal(getTestData('QnaDocumentVersionCreateModel').StorageUrl);
                expect(response.body.Data.DownloadUrl).to.equal(
                    getTestData('QnaDocumentVersionCreateModel').DownloadUrl
                );
                expect(response.body.Data.FileResourceId).to.equal(
                    getTestData('QnaDocumentVersionCreateModel').FileResourceId
                );
                expect(response.body.Data.Keywords).to.deep.equal(
                    getTestData('QnaDocumentVersionCreateModel').Keywords
                );
            })

            .expect(200, done);
    });

    it('03:03 - Get all qna document version ', function (done) {
        agent
            .get(`/api/v1/documentversions/all/`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })

            .expect(200, done);
    });

    it('03:04 - Search qna document version records', function (done) {
        loadQnaDocumentVersionQueryString();
        agent
            .get(`/api/v1/documents/search${loadQnaDocumentVersionQueryString()}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body.Data).to.have.property('TotalCount');
                expect(response.body.Data).to.have.property('RetrievedCount');
                expect(response.body.Data).to.have.property('PageIndex');
                expect(response.body.Data).to.have.property('ItemsPerPage');
                expect(response.body.Data).to.have.property('Order');
                expect(response.body.Data.TotalCount).to.be.at.least(0);
                expect(response.body.Data.RetrievedCount).to.be.at.least(0);
                expect(response.body.Data.Items.length).to.be.at.least(0);
            })
            .expect(200, done);
    });

    it('03:05 - Update qna document version ', function (done) {
        loadQnaDocumentVersionUpdateModel();
        const updateModel = getTestData('QnaDocumentVersionUpdateModel');
        agent
            .put(`/api/v1/documentversions/${getTestData('QnaDocumentVersionId_1')}`)
            .set('Content-Type', 'application/json')

            .send(updateModel)
            .expect((response) => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('VersionNumber');
                expect(response.body.Data).to.have.property('StorageUrl');
                expect(response.body.Data).to.have.property('DownloadUrl');
                expect(response.body.Data).to.have.property('FileResourceId');
                expect(response.body.Data).to.have.property('Keywords');

                expect(response.body.Data.VersionNumber).to.equal(
                    getTestData('QnaDocumentVersionUpdateModel').VersionNumber
                );
                expect(response.body.Data.StorageUrl).to.equal(getTestData('QnaDocumentVersionUpdateModel').StorageUrl);
                expect(response.body.Data.DownloadUrl).to.equal(
                    getTestData('QnaDocumentVersionUpdateModel').DownloadUrl
                );
                expect(response.body.Data.FileResourceId).to.equal(
                    getTestData('QnaDocumentVersionUpdateModel').FileResourceId
                );
                expect(response.body.Data.Keywords).to.deep.equal(
                    getTestData('QnaDocumentVersionUpdateModel').Keywords
                );
            })
            .expect(200, done);
    });

    it('03:06 - Delete qna document version', function (done) {
        agent
            .delete(`/api/v1/documentversions/${getTestData('QnaDocumentVersionId_1')}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('03:07 -> Negative - Create qna document version', function (done) {
        loadNegativeQnaDocumentVersionCreateModel();
        const createModel = getTestData('NegativeQnaDocumentVersionCreateModel');
        agent
            .post(`/api/v1/documentversions`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('03:08 -> Negative - Get qna document version by id', function (done) {
        agent
            .get(`/api/v1/documentversions/${getTestData('QnaDocumentVersionId_1')}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });

    it('01:10 -> Negative - Search qna document version records', function (done) {
        loadNegativeQnaDocumentVersionQueryString();
        agent
            .get(`/api/v1/documentversions/search${loadNegativeQnaDocumentVersionQueryString()}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(422, done);
    });

    it('03:09 -> Negative - Delete qna document version', function (done) {
        agent
            .delete(`/api/v1/documentversions/${getTestData('QnaDocumentVersionId_1')}`)
            .set('Content-Type', 'application/json')

            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(404, done);
    });
});

export const loadQnaDocumentVersionCreateModel = async () => {
    const model = {
        VersionNumber  : faker.lorem.words(10),
        StorageUrl     : faker.internet.url(),
        DownloadUrl    : faker.internet.url(),
        FileResourceId : faker.string.uuid(),
        Keywords       : [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],

        QnaDocumentId : getTestData('QnaDocumentId'),
    };

    setTestData(model, 'QnaDocumentVersionCreateModel');
};

export const loadQnaDocumentVersionUpdateModel = async () => {
    const model = {
        VersionNumber  : faker.lorem.words(10),
        StorageUrl     : faker.internet.url(),
        DownloadUrl    : faker.internet.url(),
        FileResourceId : faker.string.uuid(),
        Keywords       : [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
        QnaDocumentId  : getTestData('QnaDocumentId'),
    };
    setTestData(model, 'QnaDocumentVersionUpdateModel');
};

function loadQnaDocumentVersionQueryString() {
    const queryString = '';
    return queryString;
}

export const loadNegativeQnaDocumentVersionCreateModel = async () => {
    const model = {
        VersionNumber  : faker.person.fullName(),
        DownloadUrl    : faker.internet.url(),
        FileResourceId : faker.number.int({ min: 10, max: 100 }),
        Keywords       : faker.lorem.words(10),
    };
    setTestData(model, 'NegativeQnaDocumentVersionCreateModel');
};

function loadNegativeQnaDocumentVersionQueryString() {
    const queryString = 'abc';
    return queryString;
}
