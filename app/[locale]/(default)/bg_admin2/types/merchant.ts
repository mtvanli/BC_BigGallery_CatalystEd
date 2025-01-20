export interface CustomField {
    id: number;
    name: string;
    value: string;
  }
  
  export interface Image {
    id: number;
    url_standard: string;
    is_thumbnail: boolean;
    file?: File;
    merchant_id?:number
  }
  
  export interface Merchant {
    id: number;
    name: string;
    segment: string;
    presentation: string;
    channel: string;
    store: string;
    agency: string;
    region: string;
    industry: string;
    miscellaneous: string;
    is_visible?: boolean;
    description: string;
    custom_fields: CustomField[];
    search_keywords?: string;
    images: Image[];
  }
  
  
  
  