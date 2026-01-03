export type FieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'textarea'
  | 'url';

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  id: string;
  entityId: string;
  name: string;
  displayName: string;
  fieldType: FieldType;
  isRequired: boolean;
  options?: FieldOption[];
  defaultValue?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FieldCreatePayload {
  name: string;
  displayName: string;
  fieldType: FieldType;
  isRequired?: boolean;
  options?: FieldOption[];
  defaultValue?: string;
  order?: number;
}
