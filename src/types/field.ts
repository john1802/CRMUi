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
  | 'url'
  // New Rich UI Types
  | 'header'
  | 'label'
  | 'divider'
  | 'image'
  | 'button'
  | 'icon'
  | 'badge'
  | 'container'
  | 'card'
  | 'section'
  | 'recordGrid'
  | 'recordModal';

export interface FieldStyle {
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  height?: string;
  width?: string;
  borderRadius?: string;
  boxShadow?: string;
  border?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  opacity?: number;
  transition?: string;
  cursor?: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldCreatePayload {
  name: string;
  displayName: string;
  fieldType: FieldType;
  isRequired?: boolean;
  options?: FieldOption[];
  defaultValue?: string;
  order?: number;

  // Layout
  rowNum?: number;
  colNum?: number;
  colSpan?: number; // 1 to 12

  // Validation & Meta
  validation?: Record<string, any>;
  uiMeta?: Record<string, any>;
  style?: FieldStyle;

  // Mode Flags
  showInList?: boolean;
  showAsFilter?: boolean;
}

export interface Field extends FieldCreatePayload {
  id: string;
  entityId: string;
  createdAt: string;
  updatedAt: string;
  children?: Field[];
}
