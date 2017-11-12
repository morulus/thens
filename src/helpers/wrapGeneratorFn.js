import runGenerator from './runGenerator';

export default function wrapGeneratorFn(generatorFn) {
  return function generatorRunner(props) {
    return runGenerator(generatorFn(props));
  }
}