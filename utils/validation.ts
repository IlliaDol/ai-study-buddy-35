/**
 * Validation utilities for the KAWA application
 */

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone number validation (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Password strength validation
export function validatePassword(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one special character');
  }

  const isValid = score >= 4;
  return { isValid, score, feedback };
}

// File validation
export function validateFile(
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { isValid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  // Size check
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`,
    };
  }

  // Type check
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  // Extension check
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension .${extension} is not allowed`,
      };
    }
  }

  return { isValid: true };
}

// Image validation
export function validateImage(
  file: File,
  options: {
    maxSize?: number;
    maxWidth?: number;
    maxHeight?: number;
    allowedFormats?: string[];
  } = {}
): { isValid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxWidth = 4096,
    maxHeight = 4096,
    allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  } = options;

  // Basic file validation
  const fileValidation = validateFile(file, {
    maxSize,
    allowedTypes: allowedFormats,
  });

  if (!fileValidation.isValid) {
    return fileValidation;
  }

  // Image dimensions validation (async)
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          isValid: false,
          error: `Image dimensions must be less than ${maxWidth}x${maxHeight}px`,
        });
      } else {
        resolve({ isValid: true });
      }
    };
    img.onerror = () => {
      resolve({
        isValid: false,
        error: 'Invalid image file',
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Credit card validation (Luhn algorithm)
export function validateCreditCard(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Form validation helper
export class FormValidator {
  private errors: Map<string, string> = new Map();
  private validators: Map<string, (value: any) => string | null> = new Map();

  addValidator(field: string, validator: (value: any) => string | null): this {
    this.validators.set(field, validator);
    return this;
  }

  validate(field: string, value: any): boolean {
    const validator = this.validators.get(field);
    if (!validator) {
      return true;
    }

    const error = validator(value);
    if (error) {
      this.errors.set(field, error);
      return false;
    } else {
      this.errors.delete(field);
      return true;
    }
  }

  validateAll(data: Record<string, any>): boolean {
    let isValid = true;
    
    for (const [field, validator] of this.validators) {
      if (!this.validate(field, data[field])) {
        isValid = false;
      }
    }
    
    return isValid;
  }

  getErrors(): Map<string, string> {
    return new Map(this.errors);
  }

  getError(field: string): string | undefined {
    return this.errors.get(field);
  }

  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  clearErrors(): void {
    this.errors.clear();
  }
}

// Common validators
export const commonValidators = {
  required: (value: any): string | null => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    return null;
  },

  minLength: (min: number) => (value: string): string | null => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  },

  email: (value: string): string | null => {
    if (value && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (value && !isValidPhone(value)) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  url: (value: string): string | null => {
    if (value && !isValidUrl(value)) {
      return 'Please enter a valid URL';
    }
    return null;
  },

  numeric: (value: string): string | null => {
    if (value && !/^\d+$/.test(value)) {
      return 'Must contain only numbers';
    }
    return null;
  },

  positive: (value: number): string | null => {
    if (value <= 0) {
      return 'Must be a positive number';
    }
    return null;
  },

  range: (min: number, max: number) => (value: number): string | null => {
    if (value < min || value > max) {
      return `Must be between ${min} and ${max}`;
    }
    return null;
  },
};
