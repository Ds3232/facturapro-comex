import { ExtractedData, UploadedFile, AIProcessingResult, ProductInfo } from './types';

export class AIDocumentProcessor {
  private static instance: AIDocumentProcessor;

  public static getInstance(): AIDocumentProcessor {
    if (!AIDocumentProcessor.instance) {
      AIDocumentProcessor.instance = new AIDocumentProcessor();
    }
    return AIDocumentProcessor.instance;
  }

  /**
   * Procesa múltiples archivos y extrae información usando IA
   */
  async processDocuments(files: UploadedFile[]): Promise<AIProcessingResult> {
    const startTime = Date.now();
    
    try {
      const extractedData: ExtractedData = {};
      let totalConfidence = 0;
      let processedFiles = 0;

      for (const file of files) {
        const fileData = await this.processFile(file);
        this.mergeExtractedData(extractedData, fileData);
        totalConfidence += this.calculateFileConfidence(fileData);
        processedFiles++;
      }

      const processingTime = Date.now() - startTime;
      const averageConfidence = processedFiles > 0 ? totalConfidence / processedFiles : 0;

      return {
        success: true,
        extractedData,
        confidence: averageConfidence,
        processingTime
      };
    } catch (error) {
      return {
        success: false,
        extractedData: {},
        confidence: 0,
        processingTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Procesa un archivo individual según su tipo
   */
  private async processFile(file: UploadedFile): Promise<ExtractedData> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    switch (fileExtension) {
      case 'pdf':
        return this.processPDF(file);
      case 'xlsx':
      case 'xls':
        return this.processExcel(file);
      case 'docx':
      case 'doc':
        return this.processWord(file);
      case 'csv':
        return this.processCSV(file);
      default:
        throw new Error(`Tipo de archivo no soportado: ${fileExtension}`);
    }
  }

  /**
   * Procesa archivos PDF
   */
  private async processPDF(file: UploadedFile): Promise<ExtractedData> {
    // Simulación de procesamiento de PDF
    // En un entorno real, usarías pdf-parse o similar
    const extractedData: ExtractedData = {};

    // Patrones de expresiones regulares para extraer información común
    const content = file.content || '';
    
    // Extraer número de invoice
    const invoiceMatch = content.match(/Invoice\s*(?:Nr?\.?|Number):?\s*([A-Z0-9\-]+)/i);
    if (invoiceMatch) {
      extractedData.invoiceNumber = invoiceMatch[1];
    }

    // Extraer fecha
    const dateMatch = content.match(/Date:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);
    if (dateMatch) {
      extractedData.date = this.normalizeDate(dateMatch[1]);
    }

    // Extraer información del vendedor
    const sellerMatch = content.match(/(?:SELLER|FROM)[:\s]*([^\n]+)/i);
    if (sellerMatch) {
      extractedData.sellerName = sellerMatch[1].trim();
    }

    // Extraer información del comprador
    const buyerMatch = content.match(/(?:BUYER|TO|CUSTOMER)[:\s]*([^\n]+)/i);
    if (buyerMatch) {
      extractedData.buyerName = buyerMatch[1].trim();
    }

    // Extraer información de contenedor
    const containerMatch = content.match(/Container[:\s]*([A-Z]{4}\d{7})/i);
    if (containerMatch) {
      extractedData.containerNumber = containerMatch[1];
    }

    // Extraer información de embarcación
    const vesselMatch = content.match(/(?:M\/V|Vessel)[:\s]*([^\n]+)/i);
    if (vesselMatch) {
      extractedData.vesselName = vesselMatch[1].trim();
    }

    // Extraer productos (patrón más complejo)
    const products = this.extractProducts(content);
    if (products.length > 0) {
      extractedData.products = products;
    }

    // Extraer total
    const totalMatch = content.match(/Total[:\s]*(?:USD?)?[:\s]*?([\d,]+\.?\d*)/i);
    if (totalMatch) {
      extractedData.totalAmount = totalMatch[1];
    }

    return extractedData;
  }

  /**
   * Procesa archivos Excel
   */
  private async processExcel(file: UploadedFile): Promise<ExtractedData> {
    // Simulación de procesamiento de Excel
    // En un entorno real, usarías la librería xlsx
    const extractedData: ExtractedData = {};

    // Lógica específica para Excel
    // Típicamente contendrían listas de productos con precios
    
    return extractedData;
  }

  /**
   * Procesa archivos Word
   */
  private async processWord(file: UploadedFile): Promise<ExtractedData> {
    // Simulación de procesamiento de Word
    // En un entorno real, usarías mammoth.js
    const extractedData: ExtractedData = {};

    return extractedData;
  }

  /**
   * Procesa archivos CSV
   */
  private async processCSV(file: UploadedFile): Promise<ExtractedData> {
    // Simulación de procesamiento de CSV
    // En un entorno real, usarías papaparse
    const extractedData: ExtractedData = {};

    return extractedData;
  }

  /**
   * Extrae información de productos del texto
   */
  private extractProducts(content: string): ProductInfo[] {
    const products: ProductInfo[] = [];
    
    // Patrón para encontrar líneas de productos
    const productPattern = /([A-Z][A-Z\s\-]+)\s+(\d+(?:,\d+)?(?:\.\d+)?)\s+(\d+(?:,\d+)?(?:\.\d+)?)\s+(\d+(?:,\d+)?(?:\.\d+)?)\s+(\d+(?:,\d+)?(?:\.\d+)?)/g;
    
    let match;
    while ((match = productPattern.exec(content)) !== null) {
      products.push({
        description: match[1].trim(),
        quantity: match[2],
        weight: match[3],
        unitPrice: match[4],
        total: match[5]
      });
    }

    return products;
  }

  /**
   * Combina datos extraídos de múltiples archivos
   */
  private mergeExtractedData(target: ExtractedData, source: ExtractedData): void {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof ExtractedData];
      const targetValue = target[key as keyof ExtractedData];

      if (sourceValue && !targetValue) {
        (target as any)[key] = sourceValue;
      } else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        (target as any)[key] = [...targetValue, ...sourceValue];
      }
    });
  }

  /**
   * Calcula la confianza de la extracción para un archivo
   */
  private calculateFileConfidence(data: ExtractedData): number {
    const fields = Object.keys(data);
    const importantFields = ['invoiceNumber', 'date', 'sellerName', 'buyerName'];
    
    let score = 0;
    let maxScore = 0;

    importantFields.forEach(field => {
      maxScore += 10;
      if (data[field as keyof ExtractedData]) {
        score += 10;
      }
    });

    // Bonus por campos adicionales
    fields.forEach(field => {
      if (!importantFields.includes(field)) {
        maxScore += 5;
        if (data[field as keyof ExtractedData]) {
          score += 5;
        }
      }
    });

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  }

  /**
   * Normaliza formato de fecha
   */
  private normalizeDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr; // Retorna original si no puede parsear
    }
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Valida y limpia datos extraídos
   */
  public validateExtractedData(data: ExtractedData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validaciones básicas
    if (!data.invoiceNumber) {
      errors.push('Número de factura no encontrado');
    }

    if (!data.date) {
      errors.push('Fecha no encontrada');
    }

    if (!data.sellerName) {
      errors.push('Información del vendedor no encontrada');
    }

    if (!data.buyerName) {
      errors.push('Información del comprador no encontrada');
    }

    // Validar formato de fecha
    if (data.date && isNaN(Date.parse(data.date))) {
      errors.push('Formato de fecha inválido');
    }

    // Validar productos si existen
    if (data.products && data.products.length === 0) {
      errors.push('No se encontraron productos en los documentos');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Procesa un documento específico (ejemplo con datos reales de Australis Mar)
   */
  public async processAustralisDocument(content: string): Promise<ExtractedData> {
    const extractedData: ExtractedData = {};

    // Extraer datos específicos del formato Australis Mar
    const invoiceMatch = content.match(/Invoice Nr\.:\s*(\d+)/);
    if (invoiceMatch) {
      extractedData.invoiceNumber = invoiceMatch[1];
    }

    const dateMatch = content.match(/Date\s+([A-Za-z]+ \d{1,2}(?:st|nd|rd|th)?, \d{4})/);
    if (dateMatch) {
      extractedData.date = this.parseAustralisDate(dateMatch[1]);
    }

    // Información del vendedor (Australis Mar S.A.)
    extractedData.sellerName = "Australis Mar S.A.";
    extractedData.sellerAddress = "Decher 161, Puerto Varas, Chile";
    extractedData.sellerRut = "76.003.885-7";

    // Información del comprador
    const customerMatch = content.match(/CUSTOMER\s+"([^"]+)"/);
    if (customerMatch) {
      extractedData.buyerName = customerMatch[1];
    }

    const addressMatch = content.match(/ADDRESS\s+([\s\S]*?)(?=TERMS OF DELIVERY|$)/);
    if (addressMatch) {
      extractedData.buyerAddress = addressMatch[1].trim().replace(/\s+/g, ' ');
    }

    // Términos comerciales
    const termsMatch = content.match(/TERMS OF DELIVERY\s+([^\n]+)/);
    if (termsMatch) {
      extractedData.shippingTerms = termsMatch[1];
    }

    const paymentMatch = content.match(/TERMS OF PAYMENT\s+([^\n]+)/);
    if (paymentMatch) {
      extractedData.paymentTerms = paymentMatch[1];
    }

    // Información de envío
    const vesselMatch = content.match(/M\/N\s+([^\n]+)/);
    if (vesselMatch) {
      extractedData.vesselName = vesselMatch[1];
    }

    const containerMatch = content.match(/Container\s+([A-Z0-9]+)/);
    if (containerMatch) {
      extractedData.containerNumber = containerMatch[1];
    }

    const blMatch = content.match(/BL#\s+([A-Z0-9]+)/);
    if (blMatch) {
      extractedData.blNumber = blMatch[1];
    }

    // Fechas de embarque
    const etdMatch = content.match(/ETD\s+(\d{2}-\d{2}-\d{4})/);
    if (etdMatch) {
      extractedData.etd = etdMatch[1];
    }

    const etaMatch = content.match(/ETA\s+(\d{2}-\d{2}-\d{4})/);
    if (etaMatch) {
      extractedData.eta = etaMatch[1];
    }

    // Productos (salmón)
    const productMatch = content.match(/FROZEN ATLANTIC SALMON[^\n]*\n[^\n]*(\d+)\s+([\d,]+\.?\d*)[^\n]*(\d+\s*-\s*\d+\s*KGS)[^\n]*([\d.]+)[^\n]*([\d,]+\.?\d*)/);
    if (productMatch) {
      extractedData.products = [{
        description: "FROZEN ATLANTIC SALMON HON PREMIUM (SALMO SALAR)",
        quantity: productMatch[1] + " cartons",
        weight: productMatch[2] + " kg",
        size: productMatch[3],
        unitPrice: productMatch[4] + " USD/kg",
        total: productMatch[5] + " USD"
      }];
      
      extractedData.totalAmount = productMatch[5] + " USD";
      extractedData.netWeight = productMatch[2] + " kg";
    }

    // Información bancaria
    extractedData.bankBeneficiary = "AUSTRALIS MAR S.A.";
    extractedData.bankAccount = "5100117136";
    extractedData.bankName = "Banco Santander Chile";
    extractedData.bankSwift = "BSCHCLRM";

    // País de origen
    extractedData.countryOrigin = "CHILE";
    extractedData.loadingPort = "CORONEL, CHILE";

    return extractedData;
  }

  /**
   * Convierte fechas del formato Australis a formato estándar
   */
  private parseAustralisDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  }

  /**
   * Genera datos de ejemplo para testing
   */
  public generateMockExtractedData(): ExtractedData {
    return {
      invoiceNumber: "0000077320",
      date: "2025-08-28",
      reference: "141667",
      
      sellerName: "Australis Mar S.A.",
      sellerAddress: "Decher 161, Puerto Varas, Chile",
      sellerRut: "76.003.885-7",
      
      buyerName: "JSC RUSSIAN FISH COMPANY",
      buyerAddress: "121353, RUSSIAN FEDERATION, MOSCOW, BELOVEZHSKAYA STREET, 4",
      buyerInn: "7701174512",
      
      shippingTerms: "CFR ST. PETERSBURG ACCORDING INCOTERMS 2010",
      paymentTerms: "30% PREPAYMENT, 70% AGAINST COPY OF DOCUMENTS SENT BY EMAIL",
      currency: "USD",
      
      countryOrigin: "CHILE",
      loadingPort: "CORONEL, CHILE",
      vesselName: "MSC PANTERA /NX535R",
      containerNumber: "MEDU9179728",
      blNumber: "MEDUFP482229",
      sealNumber: "FX34216182",
      
      etd: "28-08-2025",
      eta: "10-10-2025",
      
      products: [{
        description: "FROZEN ATLANTIC SALMON HON PREMIUM (SALMO SALAR)",
        quantity: "704 cartons",
        weight: "18,484.97 kg",
        size: "6 - 7 KGS",
        unitPrice: "7.10 USD/kg",
        total: "131,243.29 USD"
      }],
      
      totalAmount: "131,243.29 USD",
      netWeight: "18,484.97 kg",
      grossWeight: "20,123.68 kg",
      numberOfBoxes: "704",
      
      producer: "PROCESADORA DUMESTRE LIMITADA",
      plantNumber: "12157",
      
      bankBeneficiary: "AUSTRALIS MAR S.A.",
      bankAccount: "5100117136",
      bankName: "Banco Santander Chile",
      bankSwift: "BSCHCLRM"
    };
  }
}