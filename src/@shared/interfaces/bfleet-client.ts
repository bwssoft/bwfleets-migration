type Contact = {
  name: string;
  email: string;
  contact: string;
};

interface ClientThemeColorVariable {
  default?: string;
  foreground?: string;
}

interface ClientTheme {
  primary?: ClientThemeColorVariable;
  secondary?: ClientThemeColorVariable;
  nav?: ClientThemeColorVariable;
}

interface IValidate {
  date: Date;
  days: number;
}

type DocType = "cpf" | "cnpj";
interface IDocument {
  type: DocType;
  value: string;
}

interface IAddress {
  country?: string | undefined;
  state?: string | undefined;
  nnumber?: string | undefined;
  street?: string | undefined;
  district?: string | undefined;
  city?: string | undefined;
  cep: string;
}

export interface BFleetClient {
  id?: string;
  subdomain: string;
  name: string;
  document: IDocument;
  contacts: Contact[];
  address: IAddress;
  user_uuid: string;
  profile_uuid: string[];
  logo?: string;
  login_background?: string;
  theme?: ClientTheme;
  parent_enterprise_uuid?: string;
  child_count: number;

  uuid?: string;
  depth: number;
  free_period: IValidate;
  validate: IValidate;
  tenant: string[];
  enterprise_uuid: string;
  restriction_uuid: string;
  created_at: Date;
  updated_at?: Date;
}
