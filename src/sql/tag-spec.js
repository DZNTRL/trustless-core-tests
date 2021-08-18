require('jasmine-expect');

const 
  _ = require('lodash')
;


describe("Tag Repository", function() {
  beforeAll(function() {
    this.sql = require('../../sql');
    const mysql = require('promise-mysql');
    this.config = require('config');
    this.pool = mysql.createPool(this.config.db);
    this.repo = this.sql.tag(this.pool);
    this.data = require('./test-data')('tagtest');
  });

  afterAll(function(done) {
    // delete tags
    this.pool.query(`DELETE from Tag WHERE name LIKE '[TEST]tag%'`).then(d => done());
done();
  });
  it("repository should have expectded functions", function() {
    expect(this.sql).toBeObject();
    expect(this.pool).toBeObject();
    expect(this.repo).toBeObject();
    expect(this.repo.save).toBeFunction();
    expect(this.repo.getByNameOrId).toBeFunction();
    expect(this.repo.getAll).toBeFunction();
    expect(this.repo.delete).toBeFunction();
    expect(this.data).toBeObject();
    expect(this.data.tags).toBeArray();
  });

  it("create tag", function(done) {
    this.repo.save(this.data.tags[0])
      .then((d) => {
        expect(d).toBeObject();
        expect(d.name).toEqual(this.data.tags[0].name);
        expect(d.id).toBeNumber();
        expect(d.id).toBeGreaterThan(0);
        this.data.tags[0].id = d.id;
        done();
      })
      .catch(e => {
        console.log(e);
        done();
      });
  });

  it("create second tag", function(done) {
    this.repo.save(this.data.tags[1])
      .then((d) => {
        expect(d).toBeObject();
        expect(d.name).toEqual(this.data.tags[1].name);
        expect(d.id).toBeNumber();
        expect(d.id).toBeGreaterThan(0);
        this.data.tags[1].id = d.id;
        expect(d.id).toBeGreaterThan(this.data.tags[0].id);
        done();
      })
      .catch(e => {
        console.log(e);
        done();
      });
  });

  it("save many tags", function(done) {
    var toSave = [
      '[TEST]tagtestAAA',
      '[TEST]tagtestBBB'
    ];
    this.repo.saveMany(toSave)
      .then((d) => {
        _.each(d, (t, i) => {
          expect(t).toBeObject();
          expect(t.name).toEqual(toSave[i]);
          expect(t.id).toBeNumber();
          expect(t.id).toBeGreaterThan(this.data.tags[1].id);
        });
        this.repo.getByNameOrId(d[0].id, true)
          .then(found => {
            expect(found.name).toEqual(toSave[0]);
            done();
          })
          .catch(e => done(e));
      })
      .catch(e => {
        console.log(e);
        done();
      });
  });


  it("find tag by name", function(done) {
    this.repo.getByNameOrId(this.data.tags[0].name).then(d => {
      expect(d).toBeObject();
      expect(d.name).toEqual(this.data.tags[0].name);
      expect(d.id).toBeNumber();
      expect(d.id).toBeGreaterThan(0);
      done();
    });
  });

  it("find tag by id", function(done) {
    this.repo.getByNameOrId(this.data.tags[0].id).then(d => {
      expect(d).toBeObject();
      expect(d.name).toEqual(this.data.tags[0].name);
      expect(d.id).toBeNumber();
      expect(d.id).toEqual(this.data.tags[0].id);
      done();
    });
  });

  it("edit tag name", function(done) {
    this.data.tags[0].name = this.data.tags[0].name + '-append';

    this.repo.save(this.data.tags[0]).then(d => {
      expect(d).toBeObject();
      expect(d.name).toEqual(this.data.tags[0].name);
      expect(d.id).toBeNumber();
      expect(d.id).toEqual(this.data.tags[0].id);
      done();
    });    
  });

  it("find tag again w new tag name", function(done) {
    this.repo.getByNameOrId(this.data.tags[0].name).then(d => {
      expect(d).toBeObject();
      expect(d.name).toEqual(this.data.tags[0].name);
      expect(d.id).toBeNumber();
      expect(d.id).toBeGreaterThan(0);
      done();
    });
  });

  it("get tags", function(done) {
    this.repo.getAll().then((d) => {
      expect(d.length).toBeGreaterThanOrEqualTo(this.data.tags.length);
      done();
    });
  });
  
  it("find no tag by unused name", function(done) {
    this.repo.getByNameOrId(`[TEST}testtag-noname`).then(d => {
      expect(d).toBeNull();
      done();
    });
  });

  it("delete tag", function(done) {
    this.repo.delete(this.data.tags[0].id).then((d) => {
      done();
    });
  });
  
});