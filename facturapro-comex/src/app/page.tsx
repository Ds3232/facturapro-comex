'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, Users, Download, Plus, Save, Eye, Trash2, 
  Edit, Check, X, Settings, Copy, Package, FileCheck, 
  FolderOpen, File, ArrowLeft, Brain, Database, FolderDown,
  Award, DollarSign, Building2, Mail, MapPin, Phone, Calendar,
  Paperclip, CheckSquare, Square, AlertCircle, Info, Search
} from 'lucide-react';

import { Client, Order, DocumentType, ExtractedData, UploadedFile } from '@/lib/types';
import { documentTypeConfigs, getDocumentConfig } from '@/lib/documentConfig';
import { AIDocumentProcessor } from '@/lib/aiProcessor';

// Helper function para obtener clases de color
const getColorClasses = (color: string) => {
  const colorMap = {
    blue: {
      text: 'text-blue-600',
      textHover: 'text-blue-700',
      bg: 'bg-blue-600',
      bgHover: 'bg-blue-700',
      bgLight: 'bg-blue-50',
      bgMedium: 'bg-blue-100',
      border: 'border-blue-500',
      borderLight: 'border-blue-200',
      borderHover: 'border-blue-300'
    },
    green: {
      text: 'text-green-600',
      textHover: 'text-green-700',
      bg: 'bg-green-600',
      bgHover: 'bg-green-700',
      bgLight: 'bg-green-50',
      bgMedium: 'bg-green-100',
      border: 'border-green-500',
      borderLight: 'border-green-200',
      borderHover: 'border-green-300'
    },
    purple: {
      text: 'text-purple-600',
      textHover: 'text-purple-700',
      bg: 'bg-purple-600',
      bgHover: 'bg-purple-700',
      bgLight: 'bg-purple-50',
      bgMedium: 'bg-purple-100',
      border: 'border-purple-500',
      borderLight: 'border-purple-200',
      borderHover: 'border-purple-300'
    },
    orange: {
      text: 'text-orange-600',
      textHover: 'text-orange-700',
      bg: 'bg-orange-600',
      bgHover: 'bg-orange-700',
      bgLight: 'bg-orange-50',
      bgMedium: 'bg-orange-100',
      border: 'border-orange-500',
      borderLight: 'border-orange-200',
      borderHover: 'border-orange-300'
    }
  };
  
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

// Helper function para renderizar iconos
const renderIcon = (iconName: string, className: string) => {
  const iconProps = { className, size: 24 };
  
  switch (iconName) {
    case 'file-text':
      return <FileText {...iconProps} />;
    case 'package':
      return <Package {...iconProps} />;
    case 'dollar-sign':
      return <DollarSign {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

export default function FacturaProApp() {
  // Estados principales
  const [currentView, setCurrentView] = useState<'dashboard' | 'clients' | 'clientDetail' | 'processor' | 'settings'>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Estados de modales
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'createClient' | 'editClient' | 'editTemplate' | 'viewDocument'>('createClient');
  const [editingTemplate, setEditingTemplate] = useState<DocumentType | null>(null);
  
  // Estados del formulario de cliente
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    address: '',
    phone: '',
    country: '',
    documentTypes: [],
    templates: {},
    orders: []
  });

  // Estados del procesador
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocs, setProcessedDocs] = useState<any[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData>({});

  // Instancia del procesador de IA
  const aiProcessor = AIDocumentProcessor.getInstance();

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Cargar datos de ejemplo
    const sampleClient: Client = {
      id: '1',
      name: "TRAPANANDA SEAFARMS LLC",
      email: "contact@trapananda.com",
      address: "123 Main St, Seattle, WA",
      phone: "+1-555-0123",
      country: "USA",
      documentTypes: ['invoice', 'packingList', 'priceList', 'quality'],
      templates: {
        invoice: getDocumentConfig('invoice').defaultTemplate,
        packingList: getDocumentConfig('packingList').defaultTemplate,
        priceList: getDocumentConfig('priceList').defaultTemplate,
        quality: getDocumentConfig('quality').defaultTemplate
      },
      orders: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setClients([sampleClient]);
  };

  // Funciones de navegación
  const showView = (view: typeof currentView, client?: Client, order?: Order) => {
    setCurrentView(view);
    if (client) setSelectedClient(client);
    if (order) setSelectedOrder(order);
  };

  // Funciones de modal
  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('createClient');
    setEditingTemplate(null);
    setNewClient({
      name: '',
      email: '',
      address: '',
      phone: '',
      country: '',
      documentTypes: [],
      templates: {},
      orders: []
    });
  };

  // Gestión de clientes
  const saveClient = () => {
    if (!newClient.name || !newClient.email) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const client: Client = {
      ...newClient as Client,
      id: Date.now().toString(),
      templates: {},
      orders: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Asignar templates por defecto para los tipos seleccionados
    newClient.documentTypes?.forEach(type => {
      client.templates[type] = getDocumentConfig(type).defaultTemplate;
    });

    setClients([...clients, client]);
    closeModal();
  };

  const createOrder = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const orderCount = client.orders.length;
    const newOrder: Order = {
      id: Date.now().toString(),
      number: `ORD-2025-${String(orderCount + 1).padStart(3, '0')}`,
      clientId: client.id,
      date: new Date().toISOString().split('T')[0],
      status: "Nueva",
      uploadedFiles: [],
      generatedDocs: [],
      extractedData: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedClients = clients.map(c => 
      c.id === clientId 
        ? { ...c, orders: [...c.orders, newOrder] }
        : c
    );
    
    setClients(updatedClients);
    setSelectedClient({ ...client, orders: [...client.orders, newOrder] });
    setSelectedOrder(newOrder);
    setCurrentView('processor');
  };

  // Gestión de archivos
  const handleFileUpload = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  // Procesamiento con IA
  const processWithAI = async () => {
    setIsProcessing(true);

    try {
      // Usar datos de ejemplo para demo
      const mockData = aiProcessor.generateMockExtractedData();
      setExtractedData(mockData);
      
      // Generar documentos basados en los templates del cliente
      const generatedDocs = selectedClient?.documentTypes.map(type => {
        const config = getDocumentConfig(type);
        return {
          type: config.name,
          icon: config.icon,
          color: config.color,
          data: mockData,
          generated: true,
          confidence: 85 + Math.random() * 10 // 85-95%
        };
      }) || [];

      setProcessedDocs(generatedDocs);
      
      // Actualizar la orden con los datos extraídos
      if (selectedOrder && selectedClient) {
        const updatedOrder = {
          ...selectedOrder,
          extractedData: mockData,
          status: 'En proceso' as const,
          updatedAt: new Date().toISOString()
        };

        const updatedClient = {
          ...selectedClient,
          orders: selectedClient.orders.map(o => 
            o.id === selectedOrder.id ? updatedOrder : o
          )
        };

        setSelectedOrder(updatedOrder);
        setSelectedClient(updatedClient);
        
        setClients(clients.map(c => 
          c.id === selectedClient.id ? updatedClient : c
        ));
      }
    } catch (error) {
      alert('Error durante el procesamiento');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Descarga de documentos
  const downloadAllDocuments = async () => {
    if (processedDocs.length === 0) {
      alert('No hay documentos para descargar. Primero procesa algunos archivos.');
      return;
    }

    try {
      const pdfs = processedDocs.map(doc => `${doc.type}_${selectedOrder?.number}.pdf`);
      alert(`Descargando ${pdfs.length} documentos PDF:\n${pdfs.join('\n')}`);
    } catch (error) {
      alert('Error al generar los PDFs');
      console.error(error);
    }
  };

  // Toggle de tipos de documentos
  const toggleDocumentType = (type: DocumentType) => {
    const currentTypes = newClient.documentTypes || [];
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    setNewClient({
      ...newClient,
      documentTypes: updatedTypes
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <FileCheck className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FacturaPro COMEX</h1>
                <p className="text-sm text-gray-600">Sistema Inteligente de Gestión Documental</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div><span className="font-medium text-gray-700">{clients.length}</span> clientes</div>
              <div><span className="font-medium text-gray-700">{clients.reduce((acc, c) => acc + c.orders.length, 0)}</span> órdenes</div>
              <div><span className="font-medium text-gray-700">{processedDocs.length}</span> documentos</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {['dashboard', 'clients', 'settings'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                  currentView === view 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="text-blue-600" size={24} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FolderOpen className="text-green-600" size={24} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Órdenes Activas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {clients.reduce((acc, c) => acc + c.orders.filter(o => o.status !== 'Completada').length, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FileText className="text-purple-600" size={24} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Documentos Generados</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {clients.reduce((acc, c) => acc + c.orders.reduce((acc2, o) => acc2 + o.generatedDocs.length, 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Brain className="text-orange-600" size={24} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Procesados por IA</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {clients.reduce((acc, c) => acc + c.orders.filter(o => Object.keys(o.extractedData).length > 0).length, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => openModal('createClient')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Plus className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm font-medium text-gray-600">Crear Nuevo Cliente</p>
                </button>
                
                <button
                  onClick={() => setCurrentView('clients')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <Search className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm font-medium text-gray-600">Ver Todos los Clientes</p>
                </button>
                
                <button
                  onClick={() => setCurrentView('settings')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Settings className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm font-medium text-gray-600">Configuración del Sistema</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
              </div>
              <div className="p-6">
                {clients.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
                ) : (
                  <div className="space-y-4">
                    {clients.slice(0, 5).map(client => (
                      <div key={client.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <Building2 className="text-gray-400" size={20} />
                          <div>
                            <p className="font-medium text-gray-900">{client.name}</p>
                            <p className="text-sm text-gray-500">{client.orders.length} órdenes</p>
                          </div>
                        </div>
                        <button
                          onClick={() => showView('clientDetail', client)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Ver detalles
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vista de Clientes */}
        {currentView === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h2>
              <button 
                onClick={() => openModal('createClient')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Nuevo Cliente</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map(client => (
                <div key={client.id} className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
                      <p className="text-gray-500 text-sm">{client.country}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail size={14} />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText size={14} />
                      <span>{client.documentTypes.length} tipos de documentos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FolderOpen size={14} />
                      <span>{client.orders.length} órdenes</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => showView('clientDetail', client)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    >
                      Ver Detalles
                    </button>
                    <button 
                      onClick={() => createOrder(client.id)}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                    >
                      Nueva Orden
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista Settings simplificada para que funcione */}
        {currentView === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-gray-600">Versión</div>
                  <div className="font-medium">FacturaPro COMEX v1.0.0</div>
                </div>
                <div>
                  <div className="text-gray-600">Estado</div>
                  <div className="font-medium text-green-600">Funcionando</div>
                </div>
                <div>
                  <div className="text-gray-600">Clientes</div>
                  <div className="font-medium">{clients.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modales */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal para Crear Cliente */}
            {modalType === 'createClient' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Crear Nuevo Cliente</h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Información Básica */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Información Básica</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la Empresa *
                        </label>
                        <input
                          type="text"
                          value={newClient.name || ''}
                          onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={newClient.email || ''}
                          onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          value={newClient.phone || ''}
                          onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          País
                        </label>
                        <input
                          type="text"
                          value={newClient.country || ''}
                          onChange={(e) => setNewClient({...newClient, country: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <textarea
                        value={newClient.address || ''}
                        onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Tipos de Documentos */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Tipos de Documentos</h4>
                    <p className="text-sm text-gray-600">Selecciona qué tipos de documentos necesita este cliente:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(documentTypeConfigs).map(([key, config]) => {
                        const isSelected = newClient.documentTypes?.includes(key as DocumentType);
                        const colorClasses = getColorClasses(config.color);
                        
                        return (
                          <div
                            key={key}
                            onClick={() => toggleDocumentType(key as DocumentType)}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected
                                ? `${colorClasses.border} ${colorClasses.bgLight}`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {isSelected ? (
                                <CheckSquare className={colorClasses.text} size={20} />
                              ) : (
                                <Square className="text-gray-400" size={20} />
                              )}
                              {renderIcon(config.icon, colorClasses.text)}
                              <span className="font-medium">{config.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={saveClient}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Crear Cliente
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
