import request from 'supertest';
import { expect } from 'chai';
import Application from '../../../src/app';
import { describe, it } from 'mocha';
import { getTestData, setTestData } from '../init';

const infra = Application.instance();

///////////////////////////////////////////////////////////////////////////

describe('01 - File resource management tests', function () {
    var agent = request.agent(infra._app);

    it('01:01 -> upload file', function (done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .field('file', 'image')
            .field('file', 'true')
            .field('Public', 'true')
            .attach('image', 'tests/api-tests/upload/demo.jpg')
            .expect((response) => {
                setTestData(response.body.Data.FileResources[0].id, 'FileId');
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(201, done);
    });

    it('01:02 -> Get resource by id', function (done) {
        agent
            .get(`/api/v1/file-resources/${getTestData('FileId')}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('success');
            })
            .expect(200, done);
    });

    it('01:03 -> Negative - upload file', function (done) {
        agent
            .post(`/api/v1/file-resources/upload/`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(400, done);
    });

    it('01:04 -> Negative - Get resource by id', function (done) {
        agent
            .get(`/api/v1/file-resources/${getTestData('FileId')}`)
            .set('Content-Type', 'application/json')
            .expect((response) => {
                expect(response.body).to.have.property('Status');
                expect(response.body.Status).to.equal('failure');
            })
            .expect(401, done);
    });
});

///////////////////////////////////////////////////////////////////////////
