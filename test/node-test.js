const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const { expect } = require('chai');

const fixtures = require('./fixtures');

const cliPath = path.join(__dirname, '..', 'node');

describe('Packdown', function () {
  describe('Node CLI', function () {
    describe('pack', function () {
      let src;
      let dst;

      beforeEach(function () {
        src = fs.mkdtempSync('/tmp/');
        dst = path.join(src, 'packed.md');
      });

      afterEach(function () {
        fs.rmdirSync(src, { recursive: true });
      });

      it('works correctly', function (done) {
        fs.writeFileSync(path.join(src, 'test.txt'), 'hello world');
        exec(`node ${cliPath} pack ${src} ${dst}`, function (err) {
          if (err) {
            done(err);
          }
          const packedFile = fs.readFileSync(dst, 'utf8');
          expect(packedFile).to.equal([
            '# /test.txt',
            '',
            '```',
            'hello world',
            '```'
          ].join('\n'));
          done();
        });
      });

      it('fails if there is an error', function (done) {
        exec(`node ${cliPath} pack non_existent_dir non_existent_file`, function (err, stdout, stderr) {
          expect(stderr).to.not.be.empty;
          done();
        });
      });
    });

    describe('unpack', function () {
      let src;
      let dst;

      beforeEach(function () {
        const filename = crypto.randomBytes(16).toString('base64').replace(/\//, '_') + '.md';
        src = path.join('/tmp/', filename);
        dst = fs.mkdtempSync('/tmp/');
        fs.writeFileSync(src, fixtures.documents.example);
      });

      afterEach(function () {
        fs.unlinkSync(src);
        fs.rmdirSync(dst, { recursive: true });
      });

      it('works correctly', function (done) {
        exec(`node ${cliPath} unpack ${src} ${dst}`, function (err) {
          if (err) {
            done(err);
          }
          const extractedFiles = fs.readdirSync(dst);
          expect(extractedFiles).to.deep.equal(['hello-world.js', 'hello-world.txt']);
          done();
        });
      });

      it('fails if there is an error', function (done) {
        exec(`node ${cliPath} unpack non_existent_file non_existent_dir`, function (err, stdout, stderr) {
          expect(stderr).to.not.be.empty;
          done();
        });
      });
    });

    it('prints usage when encountering unknown command', function (done) {
      exec(`node ${cliPath} unknown command`, function (err, stdout) {
        expect(stdout).to.include('Packdown v');
        expect(stdout).to.include('Usage: packdown');
        done();
      });
    });
  });
});
