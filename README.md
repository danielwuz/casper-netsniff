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
