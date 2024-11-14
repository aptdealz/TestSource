export const units = [
  { title: 'tons', value: 'tons' },
  { title: 'Inch', value: 'Inch' },
  { title: 'Meter', value: 'Meter' },
  { title: 'Centimeter', value: 'Centimeter' },
  { title: 'Sqfeet', value: 'Sqfeet' },
  { title: 'Sqmeter', value: 'Sqmeter' },
  { title: 'Gram', value: 'Gram' },
  { title: 'Kilogram', value: 'Kilogram' },
  { title: 'Quintal', value: 'Quintal' },
  { title: 'Tonne', value: 'Tonne' },
  { title: 'Milligram', value: 'Milligram' },
  { title: 'GSM', value: 'GSM' },
  { title: 'Dozen', value: 'Dozen' },
  { title: 'Nos', value: 'Nos' },
];

export function replaceNewlineWithBr(content: string): string {
  return content.replace(/\n/g, '<br>');
}
