export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  country: string;
  documentTypes: DocumentType[];
  templates: Record<DocumentType, DocumentTemplate>;
  orders: Order[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  number: string;
  clientId: string;
  date: string;
  status: 'Nueva' | 'En proceso' | 'Completada' | 'Cancelada';
  uploadedFiles: UploadedFile[];
  generatedDocs: GeneratedDocument[];
  extractedData: ExtractedData;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  uploadedAt: string;
}

export interface GeneratedDocument {
  id: string;
  type: DocumentType;
  name: string;
  content: string;
  pdfUrl?: string;
  generatedAt: string;
}

export interface ExtractedData {
  // Datos generales
  invoiceNumber?: string;
  date?: string;
  reference?: string;
  
  // Empresa vendedora
  sellerName?: string;
  sellerAddress?: string;
  sellerRut?: string;
  sellerPhone?: string;
  
  // Cliente comprador
  buyerName?: string;
  buyerAddress?: string;
  buyerInn?: string;
  
  // Términos comerciales
  shippingTerms?: string;
  paymentTerms?: string;
  currency?: string;
  
  // Información de envío
  countryOrigin?: string;
  loadingPort?: string;
  vesselName?: string;
  containerNumber?: string;
  blNumber?: string;
  sealNumber?: string;
  
  // Productos
  products?: ProductInfo[];
  
  // Fechas importantes
  etd?: string; // Estimated Time of Departure
  eta?: string; // Estimated Time of Arrival
  productionDate?: string;
  expirationDate?: string;
  
  // Información bancaria
  bankBeneficiary?: string;
  bankAccount?: string;
  bankName?: string;
  bankSwift?: string;
  
  // Totales
  totalAmount?: string;
  netWeight?: string;
  grossWeight?: string;
  numberOfBoxes?: string;
  
  // Certificación y calidad
  producer?: string;
  plantNumber?: string;
  certificateNumber?: string;
  authorityName?: string;
  standardsCompliance?: string[];
}

export interface ProductInfo {
  description: string;
  quantity: string;
  weight: string;
  unitPrice: string;
  total: string;
  size?: string;
  specification?: string;
}

export type DocumentType = 'invoice' | 'packingList' | 'priceList' | 'quality';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  structure: TemplateStructure;
  customFields: CustomField[];
  styling: TemplateStyle;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateStructure {
  header: Record<string, string>;
  sections: TemplateSection[];
  footer?: Record<string, string>;
}

export interface TemplateSection {
  id: string;
  name: string;
  type: 'text' | 'table' | 'list' | 'image';
  fields: Record<string, string>;
  repeatable?: boolean;
}

export interface CustomField {
  id: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
}

export interface TemplateStyle {
  fontSize: number;
  fontFamily: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  spacing: {
    margin: number;
    padding: number;
  };
  layout: 'single' | 'two-column';
}

export interface DocumentConfig {
  name: string;
  icon: string;
  color: string;
  defaultTemplate: DocumentTemplate;
  requiredFields: string[];
  optionalFields: string[];
}

export interface AIProcessingResult {
  success: boolean;
  extractedData: ExtractedData;
  confidence: number;
  errors?: string[];
  processingTime: number;
}

export interface FileProcessingOptions {
  extractText: boolean;
  extractTables: boolean;
  extractImages: boolean;
  ocrEnabled: boolean;
}

export interface PDFGenerationOptions {
  template: DocumentTemplate;
  data: ExtractedData;
  format: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  includeWatermark: boolean;
  compression: boolean;
}