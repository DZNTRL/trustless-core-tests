# Pro Web Core   Test
The testing suite for [pro-web-core](https://github.com/joshuaebowling/pro-web-core)

## Composition
1. mocha is the test runner
2. chai for assertions
3. sinon for mocks and stubs

## Current focus
`sql layer` 
    The nexus between the app and the database. Cover every method/function.
`models`
    Write only tests covering added methods/functions, not property unless some calculation is done in the model.
`service`
    Write only tests covering methods/function that do something more than merely shim the return from the corresponding data access call(s).
*Write the following tests and return the proper response model:*
[x] success given expected range of parameters
[] failure given a variance in any one paramter through relevant ranges checking the proper message/enum was returned


## Prerequisuites
1. node.js ^12.16.1
2. typescript compiler
3. npx

## Setup
1. `yarn install`
2. `yarn run build`
3. add repository [pro-web-core](https://github.com/joshuaebowling/pro-web-core). There are a few ways to do this. Ideally, this core could be any project but that would mean I would need to extract the interfaces/contracts to yet another repository. I'm open to it but don't have the time for it now.
4. `yarn run test`
