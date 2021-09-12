require('jasmine-expect');

const 
  async = require('async'),
  _ = require('lodash')
;

describe("Content Repository", function() {

  beforeAll(function(done) {
    this.sql = require('../../sql');
    const mysql = require('promise-mysql');
    this.config = require('config');
    this.pool = mysql.createPool(this.config.db);
    this.repo = this.sql.content(this.pool);
    this.data = require('./test-data')('contenttest');
    this.tagRepo = this.sql.tag(this.pool);
    async.each(this.data.tags,
      (tag, callback) => {
        tag.name += '[TEST]content';
        this.tagRepo.save(tag)
          .then((_tag) => {
            callback();
          })
          .catch(e => {
            console.log(e);
            callback(e);
          });        
        },
        (err) => {
          _.each(this.data.contents, content => {
            console.log('yep');
            content.tags = _.map(this.data.tags, d => d.name).join(',');
          });
          done();
        }
    );
  });

  afterAll(function(done) {
    this.pool.query(`DELETE from Content WHERE title LIKE '[TEST]%'`).then(d => done());
    // delete tags
    this.pool.query(`DELETE from Tag WHERE name LIKE '[TEST]content%'`).then(d => done());
  });

  it("repository should have expected functions", function() {
    expect(this.sql).toBeObject();
    expect(this.pool).toBeObject();
    expect(this.repo).toBeObject();
    expect(this.repo.save).toBeFunction();
    expect(this.repo.getByNameOrId).toBeFunction();
    expect(this.repo.getAll).toBeFunction();
    expect(this.repo.delete).toBeFunction();
    expect(this.data.contents[0].tags.split(',').length).toEqual(this.data.tags.length);
  });


  it("createa t ome content", function(done) {
    this.repo.save(this.data.contents[0])
      .then((d) => {
        expect(d).toBeObject();
        expect(d.title).toEqual(this.data.contents[0].title);
        expect(d.id).toBeNumber();
        expect(d.id).toBeGreaterThan(0);
        this.data.tags[0].id = d.id;
        done();
      })
      .catch(e => done(e));
  });

  it("find content by name", function(done) {
    this.repo.getByNameOrId(this.data.contents[0].slug)
      .then(content => {
        let original = this.data.contents[0];
        expect(content.title).toEqual(original.title);
        expect(content.markupType).toEqual(original.markupType);
        expect(content.tags).toEqual(original.tags);
        expect(content.slug).toEqual(original.slug);
        expect(content.content).toEqual(original.content);
        done();
      })
      .catch(e => done(e));
    ;
  });

  it("find content by id", function(done) {
    this.repo.getByNameOrId(this.data.contents[0].id)
    .then(content => {
      let original = this.data.contents[0];
      expect(content.title).toEqual(original.title);
      expect(content.markupType).toEqual(original.markupType);
      expect(content.tags).toEqual(original.tags);
      expect(content.slug).toEqual(original.slug);
      expect(content.content).toEqual(original.content);
      expect(content.tags).toEqual(original.tags);
      done();
    })
    .catch(e => done(e));
  ;

  });

  it("update content", function(done) {
    var original, edited;
    edited = _.clone(this.data.contents[0]);
    edited.tags += ',[TEST]appended';
    this.repo.save(edited)
      .then(content => {
        expect(content.title).toEqual(edited.title);
        expect(content.markupType).toEqual(edited.markupType);
        expect(content.tags).toEqual(edited.tags);
        expect(content.slug).toEqual(edited.slug);
        expect(content.content).toEqual(edited.content);
        expect(content.tags).toEqual(edited.tags);
        done();
      })
      .catch(e => done);
  });

  it("find content by id", function(done) {
    this.repo.getByNameOrId(this.data.contents[0].id)
    .then(content => {
      let original = this.data.contents[0];
      expect(content.title).toEqual(original.title);
      expect(content.markupType).toEqual(original.markupType);
      expect(content.slug).toEqual(original.slug);
      expect(content.content).toEqual(original.content);
      expect(content.tags).toNotEqual(original.tags);
      done();
    })
    .catch(e => done(e));
  ;

  });

  it("get by tags", function(done) {
    this.repo.getByTags([this.data.contents[0].tags])
      .then((d) => {
        expect(d).toBeArray();
        expect(d.length).toEqual(1);
        let a = d[0];
        expect(a).toBeOject();
        expect(a.title).toBeString();
        expect(a.slug).toBeString();
        expect(a.markupType).toBeString();
        expect(a.published).toBeBool();
        expect(a.created).toBeDate();        
        done();
      })
      .catch(e => done(e));
  });

  it("get nothing by tags", function(done) {
    this.repo.getByTags(['blah'])
      .then((d) => {
        expect(d).toBeArray();
        expect(d.length).toEqual(0);
        done();
      })
      .catch(e => done(e));
  });

  it("provide empty parameter query by tags", function(done) {
    this.repo.getByTags([])
      .then((d) => {
      })
      .catch(e => {
        expect(e).toEqual('Please provide a list of tags');
        done();
      });
  });
  


  it("delete content", function(done) {
    this.repo.delete(this.data.contents[0].id).then((d) => {
      done();
    });
  });
  

});