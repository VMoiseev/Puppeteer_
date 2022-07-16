import { luhnCheck, isValid, getPaySystemInfo } from '../tools';

test.each([
  ['5452931002208020', false],
  ['5452931002208021', true],
  ['5452931002208022', false],
  ['5452931002208023', false],
  ['5452931002208024', false],
  ['5452931002208025', false],
  ['5452931002208026', false],
  ['5452931002208027', false],
  ['5452931002208028', false],
  ['5452931002208029', false],

])(('the checksum should be correct'), (number, result) => {
  expect(luhnCheck(number)).toBe(result);
});

test.each([
  ['', false, 'No number value'],
  ['639002309079858005j', false, 'Invalid characters in the card number'],
  ['639002309079', false, 'The number is too short'],
  ['639002309079858006', false, 'The number is invalid'],
  ['639002309079858005', true, 'The number is valid'],

])(('the number should be valid'), (number, status, text) => {
  const result = isValid(number);
  expect(result.status).toBe(status);
  expect(result.text).toBe(text);
});

test.each([
  ['4276530011060164', 0],
  ['2202200301358644', 1],
  ['5152931002208021', 2],
  ['5252931002208021', 2],
  ['5352931002208021', 2],
  ['5452931002208021', 2],
  ['5552931002208021', 2],
  ['30123456700002', 3],
  ['36123456700002', 3],
  ['38123456700002', 3],
  ['3140123456789016', 4],
  ['3540123456789016', 4],
  ['1102200301358644', -1],

])(('the payment system code should return'), (number, code) => {
  expect(getPaySystemInfo(number)).toBe(code);
});
