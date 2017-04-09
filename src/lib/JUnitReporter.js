import Reporter from './Reporter';
import { Builder } from 'xml2js';

export default class JUnitReporter extends Reporter {

  constructor() {
    super();

    this.results = [];
  }

  report(filename, success, actual, expected, uncoveredLines) {
    super.report(filename, success, actual, expected);

    const testcase = { $: { classname: filename, name: 'Should be documented' } };

    if (!success) {
      testcase.failure = [{ $: { message: 'failed' }, _: `Lines not documented: ${uncoveredLines.join(', ')}` }]
    }

    this.results.push(testcase);
  }

  finish() {
    const report = {
      testsuites: {
        testsuite: [
          {
            $: {
              name: 'esdoc-coverage',
              tests: this.numberOfFiles,
              errors: 0,
              failures: this.notCoveredFiles,
              time: 0,
              timestamp: (new Date()).toISOString(),
            },
            testcase: this.results,
          },
        ],
      },
    };

    console.log((new Builder()).buildObject(report));
  }

  /* constructor() {
   this.table = new Table({
   head: ['File', 'Coverage'],
   });
   }

   report(filename, success, expected, actual) {

   // return super.report(filename, success, expected, actual);
   }

   finish() {
   console.log(this.table);
   } */

}
