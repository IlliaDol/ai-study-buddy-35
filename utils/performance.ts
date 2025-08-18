/**
 * Performance utilities for the KAWA application
 */

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization utility for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Performance measurement utility
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

// Async performance measurement utility
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

// Image optimization utility
export function optimizeImage(
  src: string,
  width: number,
  quality: number = 80
): string {
  // In a real app, this would use Next.js Image optimization
  // or a CDN service like Cloudinary
  return `${src}?w=${width}&q=${quality}`;
}

// Lazy loading utility for images
export function createLazyImageLoader(
  threshold: number = 0.1
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    },
    {
      threshold,
      rootMargin: '50px',
    }
  );
}

// Memory management utility
export function cleanupMemory(): void {
  if (typeof window !== 'undefined' && 'gc' in window) {
    // Force garbage collection if available
    (window as any).gc();
  }
}

// Bundle size optimization utility
export function createChunkLoader<T>(
  importFn: () => Promise<{ default: T }>
): () => Promise<T> {
  let module: T | null = null;
  
  return async () => {
    if (module) {
      return module;
    }
    
    const result = await importFn();
    module = result.default;
    return module;
  };
}

// Performance monitoring utility
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  startTimer(name: string): () => void {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      
      this.metrics.get(name)!.push(duration);
    };
  }
  
  getMetrics(name: string): {
    count: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const values = this.metrics.get(name);
    
    if (!values || values.length === 0) {
      return null;
    }
    
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
      count: values.length,
      average,
      min,
      max,
    };
  }
  
  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics');
      
      for (const [name, values] of this.metrics) {
        const metrics = this.getMetrics(name);
        if (metrics) {
          console.log(`${name}:`, metrics);
        }
      }
      
      console.groupEnd();
    }
  }
  
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Export a singleton instance
export const performanceMonitor = new PerformanceMonitor();
