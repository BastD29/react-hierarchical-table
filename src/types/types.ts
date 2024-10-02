export interface Root {
  data: Data;
  is_success: boolean;
  error_code: any;
  error_message: any;
}

export interface Data {
  roots: Root2[];
}

export interface Root2 {
  id: string;
  type: string;
  external_reference: string;
  name: string;
  model_code: string;
  children: Children[];
}

export interface Children {
  id: string;
  type: string;
  external_reference: string;
  name: string;
  model_code: string;
  children: Children2[];
}

export interface Children2 {
  id: string;
  type: string;
  external_reference: string;
  name: string;
  model_code: string;
  children: Children3[];
}

export interface Children3 {
  id: string;
  type: string;
  external_reference: string;
  name: string;
  model_code: string;
  children: any[];
}
