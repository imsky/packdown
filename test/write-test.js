const { expect } = require('chai');

const packdown = require('../src').default;

const fixtures = require('./fixtures');

describe('Packdown', function () {
  describe('Writer', function () {
    it('writes a basic file correctly', function () {
      const doc = {
        files: {
          'hello-world': {
            name: 'hello-world',
            infoString: undefined,
            headingLevel: 3,
            details: ['basic file'],
            content: ['{{foo}}', 'bar']
          }
        },
        content: ['packdown:/hello-world', '']
      };
      const out = packdown.write(doc);
      expect(out).to.equal(fixtures.documents.basic);
    });

    it('uses a default value if heading level is invalid', function () {
      const doc = {
        files: {
          hello: {
            name: 'hello',
            infoString: undefined,
            headingLevel: -1,
            details: ['basic file'],
            content: ['{{foo}}', 'bar']
          }
        },
        content: ['packdown:/hello', '']
      };
      expect(packdown.write(doc)).to.include('# /hello');
      delete doc.files.hello.headingLevel;
      expect(packdown.write(doc)).to.include('# /hello');
    });

    it('fails if content or files are missing', function () {
      expect(function () {
        packdown.write({});
      }).to.throw('Document content or files missing');

      expect(function () {
        packdown.write({ content: null })
      }).to.throw('Document content or files missing');

      expect(function () {
        packdown.write({ files: null })
      }).to.throw('Document content or files missing');
    });

    it('fails if content is not an array', function () {
      expect(function () {
        packdown.write({ content: 1, files: {} })
      }).to.throw('Document content not an array');
    });

    it('fails if files are not an object', function () {
      expect(function () {
        packdown.write({ content: [], files: 1 })
      }).to.throw('Document files not an object');
    });
  });
});
