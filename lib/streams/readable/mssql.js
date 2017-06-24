const SQL = require('mssql')

//
// Returns all results in one batch
//
module.exports.fetch = function(config, query) {

  return new Promise(
    function (resolve, reject) {
      //
      // Connect to the database
      //
      SQL.connect(config.source.uri)
        .then(function(pool) {
          return(pool.request().query(query))
        })
        .then(function(result) {
          return resolve(result)
        })
        .catch(function(err) {
          return reject(err)
        })
    }
  )
}

//
// Delivers results to the specified write
// stream. Use this for large result sets.
//
module.exports.pipe = function(config, query, writable) {
  //
  // Connect to the database
  //
  SQL.connect(config.source.uri)
    .then(function(pool) {
      //
      // Create the request
      //
      const request = pool.request()
      //
      // Attach the writable stream
      //
      request.pipe(writable)
      //
      // Submit the query
      //
      request.query(query)
      //
      // Return the result
      //
      return request
    })
    .catch(function(err) {
      console.error(err);
    });
}

//
// Set up an error handler
//
SQL.on('error', function(err) {
  console.error(err)
})
