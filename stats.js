
/**
 * Module dependencies.
 */

var request = require('superagent')
  , Enumerable = require('enumerable-component')
  , map = require('map-component')
  , fs = require('fs')
  , _ = Enumerable

/**
 * Remote url.
 */

var remote = 'http://component.io/components/all';

// fetch

console.log('fetching components');
request
.get(remote)
.end(function(res){
  if (res.error) return console.error('error: ' + res.text);
  stats(res.body);
});

/**
 * Save stats for `pkgs`.
 */

function stats(pkgs) {
  var stream = fs.createWriteStream('stats.json', { flags: 'a' });
  var repos = map(pkgs, 'repo');
  var users = _(repos).compact().map(username);

  var stats = { count: pkgs.length };
  stats.timestamp = Date.now();
  stats.authors = users.unique().array().length;

  console.log(stats);
  stream.write(JSON.stringify(stats) + '\n');
}

/**
 * Return the repo username.
 */

function username(repo) {
  return repo.split('/')[0];
}