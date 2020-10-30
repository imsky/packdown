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
          cb();
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

    it('packs correctly', function (done) {
      const filesWritten = [];
      const commands = packdown.commandFactory({
        joinPath: (a, b) => `${a}/${b}`,
        readDir: function (src, cb) {
          cb(undefined, ['file1.txt', 'file2.txt']);
        },
        readFile: function (src, cb) {
          if (src === './file1.txt') {
            cb(undefined, 'foo');
          } else if (src === './file2.txt') {
            cb(undefined, 'bar');
          } else {
            throw Error('Bad file: ' + src);
          }
        },
        writeFile: function (dst, data, cb) {
          filesWritten.push({ path: dst, data });
          cb();
        }
      });

      commands.pack('.', 'example.md', function (err) {
        if (err) {
          done(err);
        }
        expect(filesWritten).to.have.lengthOf(1);
        expect(filesWritten[0].data).to.equal('# /file1.txt\n\n```\nfoo\n```\n# /file2.txt\n\n```\nbar\n```');
        done();
      });
    });

    it('packs correctly with a merge doc', function (done) {
      const filesWritten = [];
      const commands = packdown.commandFactory({
        joinPath: (a, b) => `${a}/${b}`,
        readDir: function (src, cb) {
          cb(undefined, ['index.md', 'file2.txt']);
        },
        readFile: function (src, cb) {
          if (src === './index.md') {
            cb(undefined, '# /file1.txt\n\n```\nfoo\n```\n# /file2.txt\n\n```\nbar\n```');
          } else if (src === './file2.txt') {
            cb(undefined, 'baz');
          } else {
            throw Error('Bad file: ' + src);
          }
        },
        writeFile: function (dst, data, cb) {
          filesWritten.push({ path: dst, data });
          cb();
        }
      });

      commands.pack('.', 'example.md', function (err) {
        if (err) {
          done(err);
        }
        expect(filesWritten).to.have.lengthOf(1);
        expect(filesWritten[0].data).to.equal('# /file1.txt\n\n```\nfoo\n```\n# /file2.txt\n\n```\nbaz\n```\n');
        done();
      });
    });

    it('packs ignoring a merge doc if it has no files', function (done) {
      const filesWritten = [];
      const commands = packdown.commandFactory({
        joinPath: (a, b) => `${a}/${b}`,
        readDir: function (src, cb) {
          cb(undefined, ['index.md', 'file2.txt']);
        },
        readFile: function (src, cb) {
          if (src === './index.md') {
            cb(undefined, '# blah blah blah');
          } else if (src === './file2.txt') {
            cb(undefined, 'baz');
          } else {
            throw Error('Bad file: ' + src);
          }
        },
        writeFile: function (dst, data, cb) {
          filesWritten.push({ path: dst, data });
          cb();
        }
      });

      commands.pack('.', 'example.md', function (err) {
        if (err) {
          done(err);
        }
        expect(filesWritten).to.have.lengthOf(1);
        expect(filesWritten[0].data).to.equal('# /index.md\n\n```\n# blah blah blah\n```\n# /file2.txt\n\n```\nbaz\n```');
        done();
      });
    });

    it('does not pack if there are no files', function (done) {
      const filesWritten = [];
      const commands = packdown.commandFactory({
        readDir: function (src, cb) {
          cb(undefined, [])
        },
        writeFile: function (dst, data, cb) {
          filesWritten.push({ path: dst, data });
          cb();
        }
      });

      commands.pack('.', 'example.md', function (err) {
        if (err) {
          done(err);
        }
        expect(filesWritten).to.be.empty;
        done();
      });
    });

    it('fails to pack if readDir encounters an error', function (done) {
      const commands = packdown.commandFactory({
        readDir: function (src, cb) {
          cb('error')
        }
      });

      commands.pack('.', 'example.md', function (err) {
        expect(err).to.equal('error');
        done();
      });
    });

    it('fails to pack if readDir does not return an array', function (done) {
      const commands = packdown.commandFactory({
        readDir: function (src, cb) {
          cb()
        }
      });

      commands.pack('.', 'example.md', function (err) {
        expect(err).to.equal('Files not an array');
        done();
      });
    });

    it('fails to pack if there is an error reading a file', function (done) {
      const commands = packdown.commandFactory({
        joinPath: (a, b) => `${a}/${b}`,
        readDir: function (src, cb) {
          cb(undefined, ['file1.txt', 'file2.txt']);
        },
        readFile: function (src, cb) {
          cb('error')
        }
      });

      commands.pack('.', 'example.md', function (err) {
        expect(err).to.equal('error');
        done();
      });
    });

    it('fails to pack if there is an error reading the merge doc', function (done) {
      const commands = packdown.commandFactory({
        joinPath: (a, b) => `${a}/${b}`,
        readDir: function (src, cb) {
          cb(undefined, ['readme.md', 'file2.txt']);
        },
        readFile: function (src, cb) {
          if (src === './readme.md') {
            cb('error');
          } else if (src === './file2.txt') {
            cb(undefined, 'baz');
          } else {
            throw Error('Bad file: ' + src);
          }
        }
      });

      commands.pack('.', 'example.md', function (err) {
        expect(err).to.equal('error');
        done();
      });
    });
  });
});
