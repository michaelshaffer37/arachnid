const arachnid = require('../../../index');

describe('The Arachnid', () => {
  let spider;
  beforeEach(() => {
    spider = arachnid();
  });

  it('should broadcast a "parsed" event after calling load with a url string', (done) => {
    spider.on('parsed', (res) => {
      expect(res).toEqual(jasmine.any(Object));
      done();
    });

    spider.load('http://localhost:9000/index.html')
      .start();
  });

  it('should broadcast a "parsed" event after calling load with an array of urls', (done) => {
    spider.on('parsed', (res) => {
      expect(res).toEqual(jasmine.any(Object));
      done();
    });

    spider.load([
      'http://localhost:9000/index.html',
      'http://localhost:9000/index.html?test=yes',
    ])
      .start();
  });

  it('should broadcast 2 "parsed" events after calling load with an array of 2 urls', (done) => {
    const handlerSpy = jasmine.createSpy('handlerSpy');

    spider.on('parsed', handlerSpy);

    spider.on('pause', () => {
      expect(handlerSpy.calls.count()).toBe(2);
      done();
    });

    spider.load([
      'http://localhost:9000/index.html',
      'http://localhost:9000/index.html?test=yes',
    ])
      .start();
  });

  it('should broadcast a "pause" event after calling all loaded urls', (done) => {
    const handlerSpy = jasmine.createSpy('handlerSpy');

    spider.on('parsed', handlerSpy);

    spider.on('pause', () => {
      expect(handlerSpy.calls.count()).toBe(2);
      done();
    });

    spider.load([
      'http://localhost:9000/index.html',
      'http://localhost:9000/index.html?test=yes',
    ])
      .start();
  });

  it('should broadcast a "loading" event before a url is loaded.', () => {
    const handlerSpy = jasmine.createSpy('handlerSpy');

    spider.on('loading', handlerSpy);

    spider.load([
      'http://localhost:9000/index.html',
      'http://localhost:9000/index.html?test=yes',
    ]);

    expect(handlerSpy.calls.count()).toBe(2);
  });

  it('should broadcast a "loaded" event after a url is loaded.', (done) => {
    const handlerSpy = jasmine.createSpy('handlerSpy');

    spider.on('loaded', handlerSpy);

    spider.load([
      'http://localhost:9000/index.html',
      'http://localhost:9000/index.html?test=yes',
    ]);

    setImmediate(() => {
      expect(handlerSpy.calls.count()).toBe(2);
      done();
    });
  });

  it('should handle the simple usage example in the README', (done) => {
    spider.on('parse', (data) => {
      const names = [
        'Luke Skywalker',
        'Darth Vader',
      ];
      expect(names).toContain(JSON.parse(data).name);
    });

    spider.on('pause', () => {
      done();
    });

    spider.load([
      'https://swapi.co/api/people/1',
      'https://swapi.co/api/people/4',
    ])
      .start();
  });
});
