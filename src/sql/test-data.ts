const _ = require('lodash'),
baseTagData = {
  name: 'tag',
  type: 'test'
},
baseContentData = {
  id: 0,
  title: 'title',
  slug: 'TEST-slug',
  published: false,
  markupType: 'html',
  created: null,
  modified: null,
  content: 'content'
},
baseTagSetData = {
  id: 0,
  name: 'tagsetname',
  deleted: false,
  tags: 'tagset,test,any'  
}
;
export const baseUser = {
  id: 0,
  user: "test",
  publicKey: "publicKey"
}

export const testData = function(namespace) {
  var result;
  result = {
    tags: [],
    contents: [],
    tagSets: [],
    user: []
  };
  _.times(2, (i) => {
    result.tags.push({ name: `[TEST]tag${i}`});
    result.tagSets.push(_.extend(baseTagSetData, {name: `[TEST]tagset${i}`}));    
    result.contents.push(_.extend(baseContentData, {title: `[TEST]content${i}`, slug: `${baseContentData.slug}${i}`, content: `${baseContentData.content}${i}`, tags: '' }));
    result.user.push(_.extend(baseUser), { user: `[TEST]user${i}` })
  });
  
  return _.clone(result);
};