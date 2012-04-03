NBTF
====

by Damien Ansart.

NBTF is a Javascript reader and writer using the [NBT](http://wiki.vg/NBT) file format, written for [Node.js](http://nodejs.org/).


Usage
-----

	var nbtf = require('nbtf'),
    parser = new nbtf,
    fs = require('fs');
    
    var content = fs.readFileSync('file.nbt');
    var data = parser.parse(content);
    
    console.log(data);

Byte arrays are returned as Node.js `Buffer` objects.


Issues
------

 * 64 bit integers overflow
 * Since tag names are used as Object keys, some tags names may be not valid Javascript, thus requiring a numeric access.


Contribute to NBTF
------------------

    > git clone https://github.com/nirariel/NBTF.git
    
### Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:
    
    $ npm install

then run the tests:

    $ npm test

_________

Copyright
---------

This work is licenced under the [WTFPLv2](http://sam.zoy.org/wtfpl/)
