# Arachnid

An event based library for scrapping web content.

## Simple Usage

```javascript
const arachnid = require('arachnid');

const spiderDroid = arachnid();

spiderDroid.on('parse', (res) => {
  // Process Luke Skywalker & Darth Vader
});

spiderDroid.load([
      'https://swapi.co/api/people/1',
      'https://swapi.co/api/people/4',
])
  .start();

```