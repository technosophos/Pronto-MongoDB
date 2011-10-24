# Pronto-MongoDB: MongoDB drivers for Pronto.js

[Pronto.js](https://github.com/technosophos/Pronto.js) is a toolkit for building component-based evented systems in Node.js. Using the design pattern commonly called the Chain of Command, sequences of tasks are tied together and executed.

This project provides commands (individual components) for working with MongoDB.

## Example

Here is an example of adding a series of MongoDB operations to a `route` in `Pronto`:

```javascript
mongo = require('pronto-mongodb');
register.route('test')
  // Open a connection to a MongoDB.
  .does(mongo.Use, 'use').using('dbName', 'prontoTest')
  
  // Get (or create) a collection called 'narf'.
  .does(mongo.GetCollection, 'narf').using('dbName', 'prontoTest').using('collection', 'narf')
  
  // Insert a document into the collection.
  .does(mongo.Insert, 'doc1').using('collection').from('cxt:narf').using('data', {'doc': 1})
  
  // Add another document (using save, which is insert-or-update).
  .does(mongo.Save, 'doc2').using('collection').from('cxt:narf').using('data', {'doc': 2})
  
  // Find a single document that matches the specified filter.
  .does(mongo.FindOne, 'looky').using('collection').from('cxt:narf').using('filter', {'doc': 1})
  
  // Normally, we would do something useful here.... but we're not going to.
  
  // Drop the entire 'narf' collection.
  .does(mongo.Drop).using('collection', 'narf').using('dbName', 'prontoTest')
  
  // Close the database.
  .does(mongo.Close).using('dbName', 'prontoTest')
;
```

The above shows how Pronto-MongoDB commands can be used within a Pronto application. The example is simple, but most of the commands have many available parameters, allowing you to construct elaborate applications.

## MongoDB Features

*Q:* How do you decide which Mongo features to implement as commands?

*A:* Those that seem practical (to me) tend to get implemented. If you find a feature of MongoDB that you think should be implemented as a command, please file an issue. I'm happy to build out commands as they are useful.

Sometimes, though, it makes more sense to perform some MongoDB operations within a command. Manipulating cursors often fall into this category. It makes more sense (in most cases) to treat a cursor as a piece of data inside of a command rather than a command of some sort.

## Acknowledgements

This module is built on the `node-mongodb-native` (aka `mongodb`) driver library, which provides an excellent evented interface.

This module was sponsored by [ConsumerSearch.com](http://www.consumersearch.com), part of the About.Com network, a New York Times company.