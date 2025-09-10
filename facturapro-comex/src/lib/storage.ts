'use client';

import { Client, Order } from './types';

export class StorageManager {
  private static instance: StorageManager;
  private storageKey = 'facturapro_comex_clients';
  private ordersKey = 'facturapro_comex_orders';

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  saveClients(clients: Client[]): void {
    if (this.isClient()) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(clients));
      } catch (error) {
        console.error('Error saving clients:', error);
      }
    }
  }

  loadClients(): Client[] {
    if (this.isClient()) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : this.getDefaultClients();
      } catch (error) {
        console.error('Error loading clients:', error);
        return this.getDefaultClients();
      }
    }
    return this.getDefaultClients();
  }

  saveOrder(clientId: string, order: Order): void {
    if (this.isClient()) {
      try {
        const clients = this.loadClients();
        const updatedClients = clients.map(client => 
          client.id === clientId 
            ? { ...client, orders: [...client.orders, order] }
            : client
        );
        this.saveClients(updatedClients);
      } catch (error) {
        console.error('Error saving order:', error);
      }
    }
  }

  updateOrder(clientId: string, order: Order): void {
    if (this.isClient()) {
      try {
        const clients = this.loadClients();
        const updatedClients = clients.map(client => 
          client.id === clientId 
            ? { 
                ...client, 
                orders: client.orders.map(o => o.id === order.id ? order : o)
              }
            : client
        );
        this.saveClients(updatedClients);
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  }

  deleteClient(clientId: string): void {
    if (this.isClient()) {
      try {
        const clients = this.loadClients();
        const updatedClients = clients.filter(client => client.id !== clientId);
        this.saveClients(updatedClients);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  }

  exportData(): string {
    if (this.isClient()) {
      try {
        const clients = this.loadClients();
        return JSON.stringify({
          version: '1.0.0',
          exportDate: new Date().toISOString(),
          clients
        }, null, 2);
      } catch (error) {
        console.error('Error exporting data:', error);
        return '';
      }
    }
    return '';
  }

  importData(jsonData: string): boolean {
    if (this.isClient()) {
      try {
        const data = JSON.parse(jsonData);
        if (data.clients && Array.isArray(data.clients)) {
          this.saveClients(data.clients);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error importing data:', error);
        return false;
      }
    }
    return false;
  }

  clearAllData(): void {
    if (this.isClient()) {
      try {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.ordersKey);
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    }
  }

  private getDefaultClients(): Client[] {
    return [
      {
        id: '1',
        name: "TRAPANANDA SEAFARMS LLC",
        email: "contact@trapananda.com",
        address: "123 Main St, Seattle, WA",
        phone: "+1-555-0123",
        country: "USA",
        documentTypes: ['invoice', 'packingList', 'priceList', 'quality'],
        templates: {},
        orders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  getStorageStats(): { totalClients: number; totalOrders: number; storageUsed: string } {
    if (this.isClient()) {
      const clients = this.loadClients();
      const totalOrders = clients.reduce((acc, client) => acc + client.orders.length, 0);
      
      let storageUsed = '0 KB';
      try {
        const data = localStorage.getItem(this.storageKey) || '';
        const sizeInBytes = new Blob([data]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        storageUsed = `${sizeInKB} KB`;
      } catch (error) {
        console.error('Error calculating storage:', error);
      }

      return {
        totalClients: clients.length,
        totalOrders,
        storageUsed
      };
    }
    
    return { totalClients: 0, totalOrders: 0, storageUsed: '0 KB' };
  }
}