Casper-Netsniff
===============

Netsniff implementation in [CasperJS](http://casperjs.org/).


This script can take a URL as argument and generate HAR file, which can be used with [YSlow Command Line](http://yslow.org/command-line-har/) as input source for further performance analysis. More over, using this script as a start point, one can build automated front-end performance test with Casperjs and YSlow.


# Example

  Below code snippet is an example of getting HAR file from google.com.

    $ casperjs netsniff.js "http://www.google.com"

  This will create two files upon finish.

    * test.png: screenshot of google.com
    * test.har: HAR file

  Below is an example of how to use this HAR file for YSlow analysis.

    $ yslow --info all --format plain test.har


# License

The MIT License (MIT)

Copyright (c) 2014 Daniel Wu

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
