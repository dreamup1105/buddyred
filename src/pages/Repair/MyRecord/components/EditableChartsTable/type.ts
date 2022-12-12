type ID = number | string;
type Field = {
  key: ID;
  value: ID;
  label: string;
};
export interface EditingPart {
  product: Field;
  manufacturer: Field;
  model: Field;
  sn: string;
}
