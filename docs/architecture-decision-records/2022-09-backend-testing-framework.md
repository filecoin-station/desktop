# Testing framework for the backend

- Status: ACCEPTED

## Context

In order to test backend (`main`) components in isolation, we want to set up a Node.js testing
framework, including a library for assertions.

## Options Considered

### Built-in `node:test`

Node.js 18 is adding a built-in test framework. It can also be used in older Node versions via the
npm module `test`.

Pros
- Actively maintained framework backed by the Node.js core project
- Provides BDD style interface (`describe`, `it`)
- Test files can be run directy via `node`.

Cons
- The framework is not yet mature.
- It supports raw TAP output only, which is not human-friendly.
- Missing support for running tests in parallel and snapshot-based testing.

### Mocha

Pros
- A popular and mature framework that's still actively maintained
- Provides BDD style interface (`describe`, `it`)
- Provides human-friendly output
- Supports running tests in parallel

Cons
- Globals (`describe`, `it`)
- Test files cannot be executed directly via `node test/my-test-file.js`
- Missing support for snapshot-based testing. (Although we can easily implement this in user land.)

### TAP

Pros
- A popular and mature framework
- Provides support for running tests in parallel, snapshot-based testing, test coverage
- Test files can be run directy via `node`.

Cons
- The framework is not actively maintained
- The output is often difficult to parse; test failures are difficult to understand
- The primary API is XP-style (`test`). It's not clear to me what's the status of BDD-style API.

### Jest

Pros
- Superb DX
- Provides BDD style interface (`describe`, `it`)
- Support running tests in parallel and snapshot-based testing

Cons
- All-in-one package not composable with other components
- Custom runtime causing subtle bugs when testing Node.js code

### Built-in `assert` module

Cons:

We can get either a nice assertion description or a description of expected vs actual value, but not
both.

```
> assert.deepEqual({a: true}, {a: false})
Uncaught AssertionError [ERR_ASSERTION]: Expected values to be loosely deep-equal:

{
  a: true
}

should loosely deep-equal

{
  a: false
}
    at REPL11:1:8
    at Script.runInThisContext (node:vm:129:12)
    at REPLServer.defaultEval (node:repl:566:29)
    at bound (node:domain:421:15)
    at REPLServer.runBound [as eval] (node:domain:432:12)
    at REPLServer.onLine (node:repl:893:10)
    at REPLServer.emit (node:events:539:35)
    at REPLServer.emit (node:domain:475:12)
    at REPLServer.Interface._onLine (node:readline:487:10)
    at REPLServer.Interface._line (node:readline:864:8) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: [Object],
  expected: [Object],
  operator: 'deepEqual'
}
> assert.deepEqual({a: true}, {a: false}, 'some message')
Uncaught AssertionError [ERR_ASSERTION]: some message
    at REPL12:1:8
    at Script.runInThisContext (node:vm:129:12)
    at REPLServer.defaultEval (node:repl:566:29)
    at bound (node:domain:421:15)
    at REPLServer.runBound [as eval] (node:domain:432:12)
    at REPLServer.onLine (node:repl:893:10)
    at REPLServer.emit (node:events:539:35)
    at REPLServer.emit (node:domain:475:12)
    at REPLServer.Interface._onLine (node:readline:487:10)
    at REPLServer.Interface._line (node:readline:864:8) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: [Object],
  expected: [Object],
  operator: 'deepEqual'
}
```

### Should.js

Abandonware. The last version was released in 2017. The GitHub repository was archived.

### Chai.js

The API is still based on dangerous property-access checks (e.g. `expect(true).to.be.true`). This makes it easy to accidentally write assertions that do nothing and always pass.

See https://www.npmjs.com/package/must#beware-of-libraries-that-assert-on-property-access

## Decision

Let's use Mocha and the built-in `node:assert` module.

- Migrating from Mocha to `node:test` should be hopefully easy,  just adding `const {describe, it} =
  require('node:test')` to our test files. This is possible as long as there’s no coupling between
  the testing framework and the assertion library.

- We can hopefully contribute improvements to `node:assert` to produce more helpful error messages.

## Consequences

n/a

## Links &amp; References

- https://nodejs.org/docs/latest/api/test.html
- https://github.com/nodejs/node-core-test
- https://mochajs.org
- https://node-tap.org
- https://jestjs.io
- https://github.com/nicolo-ribaudo/jest-light-runner
- https://github.com/shouldjs/should.js
- https://www.chaijs.com/api/bdd/#method_true
- https://nodejs.org/docs/latest/api/assert.html
