const { expect } = require('chai');

const packdown = require('../src').default;

describe('Packdown', function () {
  describe('Command Factory', function () {
    it('unpacks correctly', function (done) {
      const filesRead = [];
      const filesWritten = [];
      const commands = packdown.commandFactory({
        joinPath: (a, b) => `${a}/${b}`,
        readFile: function (src, cb) {
          filesRead.push(src);
          cb(undefined, ['# /file1', '```', 'abc', '```', '# /file2', '```', 'def', '```'].join('\n'));
        },
        writeFile: function (dst, data, cb) {
          filesWritten.push({ path: dst, data });
          cb(undefined);
        }
      });

      commands.unpack('example-src', 'example-dst', function () {
        expect(filesRead).to.deep.equal(['example-src']);
        expect(filesWritten).to.have.lengthOf(2);
        expect(filesWritten[0].path).to.equal('example-dst/file1');
        expect(filesWritten[0].data).to.equal('abc');
        done();
      });
    });

    it('does nothing if there are no files to unpack', function (done) {
      const commands = packdown.commandFactory({
        readFile: function (src, cb) {
          cb();
        },
        writeFile: function (dst, data, cb) {
          cb();
        }
      });

      commands.unpack('example-src', 'example-dst', done);
    });

    it('fails on unpack error', function (done) {
      const commands = packdown.commandFactory({
        readFile: function (src, cb) {
          if (src === '.') {
            cb('read-error');
          } else {
            cb(undefined, ['# /file1', '```', 'abc', '```'].join('\n'));
          }
        },
        writeFile: function (dst, data, cb) {
          if (dst === './file1') {
            cb('write-error');
          } else {
            cb();
          }
        }
      });

      commands.unpack('.', 'example-dst', function (err) {
        expect(err).to.equal('read-error');
        commands.unpack('example-src', '.', function (err) {
          expect(err).to.equal('write-error');
          done();
        });
      });
    });
  });
});
