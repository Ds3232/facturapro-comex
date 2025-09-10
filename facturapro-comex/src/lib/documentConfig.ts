import { DocumentConfig, DocumentTemplate, DocumentType } from './types';

export const documentTypeConfigs: Record<DocumentType, DocumentConfig> = {
  invoice: {
    name: 'Commercial Invoice',
    icon: 'file-text',
    color: 'blue',
    requiredFields: ['invoiceNumber', 'date', 'sellerName', 'buyerName', 'totalAmount'],
    optionalFields: ['reference', 'shippingTerms', 'paymentTerms', 'currency'],
    defaultTemplate: {
      id: 'default-invoice',
      name: 'Commercial Invoice Standard',
      type: 'invoice',
      structure: {
        header: {
          title: 'COMMERCIAL INVOICE',
          invoiceNumber: '{{invoiceNumber}}',
          date: '{{date}}',
          reference: '{{reference}}'
        },
        sections: [
          {
            id: 'seller-info',
            name: 'Seller Information',
            type: 'text',
            fields: {
              name: '{{sellerName}}',
              address: '{{sellerAddress}}',
              rut: '{{sellerRut}}',
              phone: '{{sellerPhone}}'
            }
          },
          {
            id: 'buyer-info',
            name: 'Buyer Information',
            type: 'text',
            fields: {
              name: '{{buyerName}}',
              address: '{{buyerAddress}}',
              inn: '{{buyerInn}}'
            }
          },
          {
            id: 'shipping-info',
            name: 'Shipping Information',
            type: 'text',
            fields: {
              terms: '{{shippingTerms}}',
              origin: '{{countryOrigin}}',
              loadingPort: '{{loadingPort}}',
              vessel: '{{vesselName}}',
              container: '{{containerNumber}}',
              bl: '{{blNumber}}'
            }
          },
          {
            id: 'products',
            name: 'Products',
            type: 'table',
            repeatable: true,
            fields: {
              description: '{{productDescription}}',
              quantity: '{{quantity}}',
              weight: '{{weight}}',
              unitPrice: '{{unitPrice}}',
              total: '{{totalAmount}}'
            }
          },
          {
            id: 'banking-info',
            name: 'Banking Information',
            type: 'text',
            fields: {
              beneficiary: '{{bankBeneficiary}}',
              account: '{{bankAccount}}',
              bank: '{{bankName}}',
              swift: '{{bankSwift}}'
            }
          }
        ]
      },
      customFields: [],
      styling: {
        fontSize: 12,
        fontFamily: 'Arial',
        colors: {
          primary: '#1f2937',
          secondary: '#6b7280',
          text: '#374151',
          background: '#ffffff'
        },
        spacing: {
          margin: 20,
          padding: 15
        },
        layout: 'single'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  packingList: {
    name: 'Packing List',
    icon: 'package',
    color: 'green',
    requiredFields: ['date', 'fromName', 'toName', 'productDescription'],
    optionalFields: ['contractNumber', 'vesselName', 'containerNumber'],
    defaultTemplate: {
      id: 'default-packing',
      name: 'Packing List Standard',
      type: 'packingList',
      structure: {
        header: {
          title: 'PACKING LIST',
          date: '{{date}}'
        },
        sections: [
          {
            id: 'from-info',
            name: 'From',
            type: 'text',
            fields: {
              name: '{{fromName}}',
              address: '{{fromAddress}}',
              phone: '{{fromPhone}}'
            }
          },
          {
            id: 'to-info',
            name: 'To',
            type: 'text',
            fields: {
              name: '{{toName}}',
              address: '{{toAddress}}',
              inn: '{{toInn}}'
            }
          },
          {
            id: 'contract-info',
            name: 'Contract Information',
            type: 'text',
            fields: {
              number: '{{contractNumber}}',
              date: '{{contractDate}}'
            }
          },
          {
            id: 'shipping-details',
            name: 'Shipping Details',
            type: 'text',
            fields: {
              terms: '{{deliveryTerms}}',
              origin: '{{countryOrigin}}',
              vessel: '{{vesselName}}',
              container: '{{containerNumber}}',
              bl: '{{blNumber}}'
            }
          },
          {
            id: 'product-details',
            name: 'Product Details',
            type: 'table',
            repeatable: true,
            fields: {
              size: '{{productSize}}',
              boxes: '{{numberOfBoxes}}',
              netWeight: '{{netWeight}}',
              grossWeight: '{{grossWeight}}',
              prodDate: '{{productionDate}}',
              expDate: '{{expirationDate}}'
            }
          }
        ]
      },
      customFields: [],
      styling: {
        fontSize: 11,
        fontFamily: 'Arial',
        colors: {
          primary: '#065f46',
          secondary: '#6b7280',
          text: '#374151',
          background: '#ffffff'
        },
        spacing: {
          margin: 20,
          padding: 15
        },
        layout: 'single'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  priceList: {
    name: 'Price List',
    icon: 'dollar-sign',
    color: 'purple',
    requiredFields: ['date', 'companyName', 'currency'],
    optionalFields: ['validityDate', 'customerName', 'paymentTerms'],
    defaultTemplate: {
      id: 'default-price',
      name: 'Price List Standard',
      type: 'priceList',
      structure: {
        header: {
          title: 'PRICE LIST',
          date: '{{date}}',
          validUntil: '{{validityDate}}'
        },
        sections: [
          {
            id: 'company-info',
            name: 'Company Information',
            type: 'text',
            fields: {
              name: '{{companyName}}',
              address: '{{companyAddress}}'
            }
          },
          {
            id: 'customer-info',
            name: 'Customer Information',
            type: 'text',
            fields: {
              name: '{{customerName}}',
              reference: '{{customerReference}}'
            }
          },
          {
            id: 'terms',
            name: 'Terms',
            type: 'text',
            fields: {
              currency: '{{currency}}',
              payment: '{{paymentTerms}}',
              delivery: '{{deliveryTerms}}',
              validity: '{{validityPeriod}}'
            }
          },
          {
            id: 'products',
            name: 'Products',
            type: 'table',
            repeatable: true,
            fields: {
              description: '{{productDescription}}',
              specification: '{{productSpec}}',
              unitPrice: '{{unitPrice}}',
              minimumOrder: '{{minOrder}}'
            }
          }
        ]
      },
      customFields: [],
      styling: {
        fontSize: 12,
        fontFamily: 'Arial',
        colors: {
          primary: '#7c3aed',
          secondary: '#6b7280',
          text: '#374151',
          background: '#ffffff'
        },
        spacing: {
          margin: 20,
          padding: 15
        },
        layout: 'single'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  quality: {
    name: 'Quality Certificate',
    icon: 'award',
    color: 'orange',
    requiredFields: ['certificateNumber', 'date', 'authorityName', 'productDescription'],
    optionalFields: ['laboratoryName', 'standardsCompliance', 'validityPeriod'],
    defaultTemplate: {
      id: 'default-quality',
      name: 'Quality Certificate Standard',
      type: 'quality',
      structure: {
        header: {
          title: 'QUALITY CERTIFICATE',
          certificateNumber: '{{certificateNumber}}',
          date: '{{issueDate}}'
        },
        sections: [
          {
            id: 'authority-info',
            name: 'Certifying Authority',
            type: 'text',
            fields: {
              name: '{{authorityName}}',
              address: '{{authorityAddress}}',
              license: '{{licenseNumber}}'
            }
          },
          {
            id: 'product-info',
            name: 'Product Information',
            type: 'text',
            fields: {
              description: '{{productDescription}}',
              origin: '{{countryOrigin}}',
              producer: '{{producerName}}',
              batchNumber: '{{batchNumber}}'
            }
          },
          {
            id: 'analysis-info',
            name: 'Analysis Information',
            type: 'text',
            fields: {
              laboratory: '{{laboratoryName}}',
              method: '{{analysisMethod}}',
              date: '{{analysisDate}}'
            }
          },
          {
            id: 'standards',
            name: 'Standards Compliance',
            type: 'table',
            repeatable: true,
            fields: {
              parameter: '{{parameter}}',
              result: '{{result}}',
              standard: '{{standardValue}}',
              status: '{{status}}'
            }
          },
          {
            id: 'certification',
            name: 'Certification Details',
            type: 'text',
            fields: {
              standards: '{{certificationStandards}}',
              validity: '{{validityPeriod}}',
              inspector: '{{inspectorName}}'
            }
          }
        ]
      },
      customFields: [],
      styling: {
        fontSize: 12,
        fontFamily: 'Arial',
        colors: {
          primary: '#ea580c',
          secondary: '#6b7280',
          text: '#374151',
          background: '#ffffff'
        },
        spacing: {
          margin: 20,
          padding: 15
        },
        layout: 'single'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};

export const getDocumentConfig = (type: DocumentType): DocumentConfig => {
  return documentTypeConfigs[type];
};

export const getAllDocumentTypes = (): DocumentType[] => {
  return Object.keys(documentTypeConfigs) as DocumentType[];
};

export const getDefaultTemplate = (type: DocumentType): DocumentTemplate => {
  return documentTypeConfigs[type].defaultTemplate;
};