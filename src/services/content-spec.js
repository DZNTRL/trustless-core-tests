require('jasmine-expect');

const 
  async = require('async'),
  _ = require('lodash')
;

describe("Content Service", function() {
  beforeAll(function(done) {
    this.sql = require('../../sql');
    this.services = require('../../services');
    const mysql = require('promise-mysql');
    this.config = require('config');
    this.pool = mysql.createPool(this.config.db);
    this.service = this.services.content(this.sql.content(this.pool));
    this.data = require('../sql/test-data')('contentsvctest');
    this.tagService = this.services.tag(this.sql.tag(this.pool));
    async.forEachOf(this.data.tags,
      (tag, i, callback) => {
        this.tagService.save(tag)
          .then((_tag) => { 
            this.data.tags[i].id = _tag.id;
            callback();
          })
          .catch(e => {
            console.log(e);
            done();
          });        
        },
        (err) => {
          _.each(this.data.contents, (content, i) => {
            this.data.contents[i].tags = _.map(this.data.tags, d => d.name).join(',');
            done();
          });
        }
    );
  });

  afterAll(function(done) {
    this.pool.query(`DELETE from Content WHERE title LIKE '[TEST]%'`).then(d => done());
    // delete tags
    this.pool.query(`DELETE from Tag WHERE name LIKE '[TEST]contentsvctest%'`).then(d => done());
  });

  it("repository should have expected functions", function() {
    expect(this.sql).toBeObject();
    expect(this.pool).toBeObject();
    expect(this.service).toBeObject();
    expect(this.service.save).toBeFunction();
    expect(this.service.getByNameOrId).toBeFunction();
    expect(this.service.getAll).toBeFunction();
    expect(this.service.delete).toBeFunction();
    expect(this.data.contents[0].tags.split(',').length).toEqual(this.data.tags.length);
  });

  xit("create content", function(done) {
    this.service.save(this.data.contents[0]).then((d) => {
      expect(d).toBeObject();
      expect(d.title).toEqual(this.data.contents[0].title);
      expect(d.id).toBeNumber();
      expect(d.id).toBeGreaterThan(0);
      expect(d.tags).toBeString();
      this.data.tags[0].id = d.id;
      done();
    });
  });

  xit("find content by name", function() {});

  xit("find content by id", function() {});

  xit("delete content", function(done) {
    this.service.delete(this.data.contents[0].id).then((d) => {
      done();
    });
  });
  

});