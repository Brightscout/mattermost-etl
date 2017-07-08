//
// Implements a fake db for testing
//
class FakeDB {
  //
  // Constructor
  //
  constructor(data) {
    this.data = data
    this.fetch = this.fetch.bind(this)
    this.pipe = this.pipe.bind(this)
  }

  //
  // Simulate a db connection by just returning
  // a promise
  //
  connect() {
    return Promise.resolve()
  }

  //
  // Returns all results in one batch
  //
  fetch() {
    return Promise.resolve({
      recordset: this.data
    })
  }

  //
  // Delivers results to the specified write
  // stream
  //
  pipe(query, writable) {

    this.data.forEach(function(record) {
      writable.write(record)
    })

    writable.end()

    return writable
  }
}

//
// Export the class
//
module.exports = FakeDB
