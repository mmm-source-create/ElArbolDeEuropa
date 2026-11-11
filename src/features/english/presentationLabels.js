import labels from '../../generated/englishLabelsRuntime.json' with {type:'json'};
export const englishLabel=value=>value==null?value:labels[value]||value;
