export type FieldDataType = 'text' | 'number' | 'email' | 'date' | 'dropdown' | 'lookup' | 'boolean';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
}

export interface FieldUiMeta {
  placeholder?: string;
  tooltip?: string;
  hidden?: boolean;
  readOnly?: boolean;
  className?: string;
}

export interface FieldDefinition {
  id?: string; // Optional for new fields before saving
  name: string; // key used in JSON
  label: string; // UI label
  dataType: FieldDataType;
  isRequired: boolean;

  // Layout
  rowNum?: number;
  colNum?: number;
  colSpan?: number; // 1 to 12

  // Configuration
  options?: FieldOption[]; // For dropdowns
  lookupEntityId?: string; // For relations
  validation?: FieldValidation;
  uiMeta?: FieldUiMeta;
}

export interface EntityDefinition {
  id: string;
  name: string;
  label: string;
}

export interface ScreenDefinition {
  entity: EntityDefinition;
  fields: FieldDefinition[]; // Keeping for backward compatibility
  formFields?: FieldDefinition[];
  listFields?: FieldDefinition[];
  lookups?: Record<string, any>;
}
