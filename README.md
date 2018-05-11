# xlsx-parse-json #

### Description ###
Parse csv, xls, xlsx into json

### Install ###
````
npm install xlsx-parse-json
````

### Use node ###
React Example
````
import xlsxParser from 'xlsx-parse-json';

xlsxParser
  .onFileSelection(file)
  .then(data => {
    var parsedData = data;
  });

````

# input file #
````
Name	| Lastname	| Age
-------------------------
test1	| node		| 4
test2	| node		|
test3	| node		| 9
test4	| node		|

````

# output sample #
````
[
  {
    "Name": "test1",
    "Lastname": "node",
    "Age": 4
  },
  {
    "Name": "test2",
    "Lastname": "node"
  },
  {
    "Name": "test3",
    "Lastname": "node",
    "Age": 9
  },
  {
    "Name": "test4",
    "Lastname": "node"
  }
]
````