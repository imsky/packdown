const { expect } = require('chai');

const packdown = require('../src').default;

const fixtures = require('./fixtures');

describe('Packdown', function () {
  describe('Reader', function () {
    it('reads a basic file correctly', function () {
      const doc = packdown.read(fixtures.documents.basic);
      expect(doc.files['hello-world']).to.exist;
      expect(doc.files['hello-world']).to.deep.equal({
        name: 'hello-world',
        headingLevel: 3,
        details: ['basic file'],
        infoString: undefined,
        content: ['{{foo}}', 'bar']
      });
      expect(doc.content).to.deep.equal([
        'packdown:/hello-world',
        ''
      ]);
    });

    it('reads an example file correctly', function () {
      const doc = packdown.read(fixtures.documents.example);
      expect(doc.files['hello-world.js']).to.exist;
      expect(doc.files['hello-world.txt']).to.exist;
      expect(doc.files['hello-world.js']).to.deep.equal({
        name: 'hello-world.js',
        headingLevel: 3,
        details: [],
        infoString: 'js',
        content: [`console.log('hello');`, `console.log('world');`]
      });
      expect(doc.content).to.deep.equal([
        'packdown:/hello-world.js',
        '',
        'packdown:/hello-world.txt',
        ''
      ]);
    });

    it('reads an edge-case file correctly', function () {
      const doc = packdown.read(fixtures.documents.edgeCase);
      expect(doc.files.foo).to.exist;
      expect(doc.files.bar).to.exist;
      expect(doc.files.empty).to.exist;
      expect(doc.files.foo.content).to.deep.equal([
        'not space',
        '',
        'encoded'
      ]);
      expect(doc.files.bar.content).to.deep.equal([
        '',
        '    this line is space-encoded',
        'this line is not'
      ]);
    });

    it('processes a single-line code block as indented correctly', function () {
      const doc = packdown.read(['# /file1', '```txt', '    example', '```'].join('\n'));
      expect(doc.files.file1.content).to.deep.equal(['example']);
    });

    it('ignores subsequent code blocks for a file', function () {
      const doc = packdown.read(['# /file1', '```txt', 'a', '```', '```txt', 'b', '```'].join('\n'));
      expect(doc.files.file1.content).to.deep.equal(['a']);
    });

    it('fails on unexpected file', function () {
      expect(function () {
        packdown.read(['# /file1', '# /file2'].join('\n'))
      }).to.throw('Unexpected file');
    });

    it('fails on invalid code block', function () {
      expect(function () {
        packdown.read(['# /file1', '```txt', '```txt'].join('\n'))
      }).to.throw('Invalid code block');
    });

    it('fails on truncated input', function () {
      expect(function () {
        packdown.read(['# /file1', '```txt'].join('\n'))
      }).to.throw('Truncated input');
    });
  });
});
