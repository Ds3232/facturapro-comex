/**
 * Utilidades para manejar clases CSS dinámicas de Tailwind
 */

export type ColorVariant = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'indigo' | 'pink';

export interface ColorClasses {
  text: string;
  textHover: string;
  bg: string;
  bgHover: string;
  bgLight: string;
  bgMedium: string;
  border: string;
  borderLight: string;
  borderHover: string;
}

/**
 * Obtiene las clases de color para un color específico
 */
export const getColorClasses = (color: ColorVariant): ColorClasses => {
  const colorMap: Record<ColorVariant, ColorClasses> = {
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
    },
    red: {
      text: 'text-red-600',
      textHover: 'text-red-700',
      bg: 'bg-red-600',
      bgHover: 'bg-red-700',
      bgLight: 'bg-red-50',
      bgMedium: 'bg-red-100',
      border: 'border-red-500',
      borderLight: 'border-red-200',
      borderHover: 'border-red-300'
    },
    yellow: {
      text: 'text-yellow-600',
      textHover: 'text-yellow-700',
      bg: 'bg-yellow-600',
      bgHover: 'bg-yellow-700',
      bgLight: 'bg-yellow-50',
      bgMedium: 'bg-yellow-100',
      border: 'border-yellow-500',
      borderLight: 'border-yellow-200',
      borderHover: 'border-yellow-300'
    },
    indigo: {
      text: 'text-indigo-600',
      textHover: 'text-indigo-700',
      bg: 'bg-indigo-600',
      bgHover: 'bg-indigo-700',
      bgLight: 'bg-indigo-50',
      bgMedium: 'bg-indigo-100',
      border: 'border-indigo-500',
      borderLight: 'border-indigo-200',
      borderHover: 'border-indigo-300'
    },
    pink: {
      text: 'text-pink-600',
      textHover: 'text-pink-700',
      bg: 'bg-pink-600',
      bgHover: 'bg-pink-700',
      bgLight: 'bg-pink-50',
      bgMedium: 'bg-pink-100',
      border: 'border-pink-500',
      borderLight: 'border-pink-200',
      borderHover: 'border-pink-300'
    }
  };
  
  return colorMap[color] || colorMap.blue;
};

/**
 * Combina clases CSS de manera condicional
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Obtiene clases de estado para diferentes estados de orden
 */
export const getStatusClasses = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Nueva': 'bg-gray-100 text-gray-800',
    'En proceso': 'bg-yellow-100 text-yellow-800',
    'Completada': 'bg-green-100 text-green-800',
    'Cancelada': 'bg-red-100 text-red-800'
  };
  
  return statusMap[status] || statusMap['Nueva'];
};

/**
 * Obtiene clases para diferentes niveles de confianza
 */
export const getConfidenceClasses = (confidence: number): string => {
  if (confidence >= 90) return 'text-green-600 bg-green-50';
  if (confidence >= 75) return 'text-yellow-600 bg-yellow-50';
  if (confidence >= 60) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};