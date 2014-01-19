/*global phantom*/
"use strict";

(function(){
  var fs = require('fs'),
      utils = require('utils');

  // format date string
  if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
      function pad(n) { return n < 10 ? '0' + n : n; }
      function ms(n) { return n < 10 ? '00'+ n : n < 100 ? '0' + n : n; }
      return this.getFullYear() + '-' +
        pad(this.getMonth() + 1) + '-' +
        pad(this.getDate()) + 'T' +
        pad(this.getHours()) + ':' +
        pad(this.getMinutes()) + ':' +
        pad(this.getSeconds()) + '.' +
        ms(this.getMilliseconds()) + 'Z';
    };
  }

  // create customized casper class
  var Casper = (function(){

    var HARCasper = function() {
      HARCasper.super_.apply(this, arguments);
      this.resources = {};
    };

    utils.inherits(HARCasper, require('casper').Casper);

    HARCasper.prototype.on("load.started", function(){
      this.startTime = new Date();
    });

    HARCasper.prototype.on("resource.received", function(res) {
      if (res.stage === 'start') {
        this.resources[res.id].startReply = res;
      } else if (res.stage === 'end') {
        this.resources[res.id].endReply = res;
      }
    });

    HARCasper.prototype.on("resource.requested", function(req) {
      this.resources[req.id] = {
        request: req,
        startReply: null,
        endReply: null
      };
    });

    HARCasper.prototype.createHAR = function(address, title, startTime, resources) {
      var entries = [];

      resources.forEach(function (resource) {
        if (!resource){
          return;
        }
        var request = resource.request,
            startReply = resource.startReply,
            endReply = resource.endReply;

        if (!request || !startReply || !endReply) {
          return;
        }

        // Exclude Data URI from HAR file because
        // they aren't included in specification
        if (request.url.match(/(^data:image\/.*)/i)) {
          return;
        }

        entries.push({
          startedDateTime: request.time.toISOString(),
          time: endReply.time - request.time,
          request: {
            method: request.method,
            url: request.url,
            httpVersion: "HTTP/1.1",
            cookies: [],
            headers: request.headers,
            queryString: [],
            headersSize: -1,
            bodySize: -1
          },
          response: {
            status: endReply.status,
            statusText: endReply.statusText,
            httpVersion: "HTTP/1.1",
            cookies: [],
            headers: endReply.headers,
            redirectURL: "",
            headersSize: -1,
            bodySize: startReply.bodySize,
            content: {
              size: startReply.bodySize,
              mimeType: endReply.contentType
            }
          },
          cache: {},
          timings: {
            blocked: 0,
            dns: -1,
            connect: -1,
            send: 0,
            wait: startReply.time - request.time,
            receive: endReply.time - startReply.time,
            ssl: -1
          },
          pageref: address
        });
      });

      return {
        log: {
          version: '1.2',
          creator: {
            name: "PhantomJS",
            version: phantom.version.major + '.' + phantom.version.minor +
              '.' + phantom.version.patch
          },
          pages: [{
            startedDateTime: startTime.toISOString(),
            id: address,
            title: title,
            pageTimings: {
              onLoad: this.endTime - this.startTime
            }
          }],
          entries: entries
        }
      };
    };

    HARCasper.prototype.dumpHAR = function() {
      var title = this.getTitle();
      var url = this.getCurrentUrl();
      var har = this.createHAR(url, title, this.startTime, this.resources);
      return JSON.stringify(har, undefined, 4);
    };

    return HARCasper;
  }());

  var casper = new Casper({
    verbose: false,
    logLevel: 'info',
    userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)'
  });

  var url = casper.cli.args[0];

  if (!url) {
    console.error("Usage:\n");
    console.error("  casperjs CasperSniff.js URL\n");
    casper.exit();
  }

  casper.start(url, function() {
    var har = this.dumpHAR();
    casper.capture("test.png");
    fs.write("test.har", har);
  });

  casper.run();
}(this));
