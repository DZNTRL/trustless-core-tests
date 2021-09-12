require('jasmine-expect');

const 
  _ = require('lodash'),
  obj = 'tagSet'
;


describe("TagSet Repository", function() {
  beforeAll(function() {
    this.sql = require('../../sql');
    const mysql = require('promise-mysql');
    this.config = require('config');
    this.pool = mysql.createPool(this.config.db);
    this.repo = this.sql.tagSet(this.pool);
    this.data = require('./test-data')('tagsettest');
    this.modelSet = this.data.tagSets;
  });

  afterAll(function(done) {
    // delete tags
    this.pool.query(`DELETE from TagSet WHERE name LIKE '[TEST]tagset%'`).then(d => done());
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
    expect(this.data.tagSets).toBeArray();
  });

  it(`create ${obj}`, function(done) {
    var original = this.modelSet[0];
    original.name = original.name;
    this.repo.save(original)
      .then((d) => {
        expect(d).toBeObject();
        expect(d.name).toEqual(original.name);
        expect(d.id).toBeNumber();
        expect(d.tags).toEqual(original.tags);
        expect(d.id).toBeGreaterThan(0);
        this.modelSet[0].id = d.id;
        done();
      })
      .catch(e => {
        console.log(e);
        done();
      });
  });

  it(`create second ${obj}`, function(done) {
    var original = this.modelSet[1] = {
      id: 0,
      name: '[TEST]tagsetname2',
      deleted: false,
      tags: 'tagset,test,any'  
    }
    
    this.repo.save(original)
      .then((d) => {
        expect(d).toBeObject();
        expect(d.name).toEqual(original.name);
        expect(d.id).toBeNumber();
        expect(d.tags).toEqual(original.tags);
        expect(d.id).toBeGreaterThan(0);
        this.modelSet[1].id = d.id;
        done();
      })
      .catch(e => {
        console.log(e);
        done();
      });
  });

  it(`find ${obj} by name`, function(done) {
    var original = this.modelSet[0];
    this.repo.getByNameOrId(this.modelSet[0].name).then(d => {
      expect(d).toBeObject();
      expect(d.name).toEqual(this.modelSet[0].name);
      expect(d.id).toBeNumber();
      expect(d.id).toBeGreaterThan(0);
      expect(d.tags).toEqual(original.tags);      
      done();
    });
  });

  it(`find ${obj} by id`, function(done) {    
    var original = this.modelSet[0];
    this.repo.getByNameOrId(original.id).then(d => {
      expect(d).toBeObject();
      expect(d.name).toEqual(original.name);
      expect(d.id).toBeNumber();
      expect(d.id).toEqual(original.id);
      expect(d.tags).toEqual(original.tags);      
      done();
    });
  });

  it(`edit ${obj} name`, function(done) {
    var original = this.modelSet[0];
    original.name += '-append';
    original.tags += ',append';
    this.repo.save(original).then(d => {
      expect(d).toBeObject();
      expect(d.name).toEqual(original.name);
      expect(d.id).toBeNumber();
      expect(d.id).toEqual(original.id);
      expect(d.tags).toEqual(original.tags);      
      done();
    });    
  });

  it(`find ${obj} again w new tag name`, function(done) {
    var original = this.modelSet[0];
    this.repo.getByNameOrId(original.name).then(d => {
      expect(d).toBeObject();
      expect(d.name).toEqual(original.name);
      expect(d.id).toBeNumber();
      expect(d.id).toBeGreaterThan(0);
      expect(d.tags).toEqual(original.tags);      
      done();
    });
  });

  it("get tags", function(done) {
    this.repo.getAll().then((d) => {
      expect(d.length).toBeGreaterThanOrEqualTo(this.modelSet.length);
      done();
    });
  });


  it("delete tag", function(done) {
    this.repo.delete(this.modelSet[0].id).then((d) => {
      this.repo.getByNameOrId(this.modelSet[0].id)
        .then((d) => {
          expect(d.deleted).toEqual(1);
          done();
        });
    });
  });
  

});