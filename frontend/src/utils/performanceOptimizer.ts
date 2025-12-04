// Performance optimization utilities
export class PerformanceOptimizer {
  // Debounce function to limit function calls
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle function to limit function calls
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Lazy load images
  static lazyLoadImage(img: HTMLImageElement, src: string) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    });

    observer.observe(img);
  }

  // Memoize expensive calculations
  static memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();

    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }

  // Batch DOM updates
  static batchUpdate(updates: (() => void)[]) {
    requestAnimationFrame(() => {
      updates.forEach((update) => update());
    });
  }

  // Preload critical resources
  static preloadResource(href: string, as: string) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }

  // Optimize scroll events
  static optimizeScroll(callback: () => void, threshold: number = 10) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) >= threshold) {
        callback();
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });

    return () => window.removeEventListener("scroll", requestTick);
  }

  // Optimize resize events
  static optimizeResize(callback: () => void) {
    let timeout: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(callback, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeout) clearTimeout(timeout);
    };
  }

  // Virtual scrolling for large lists
  static createVirtualScroll(
    container: HTMLElement,
    itemHeight: number,
    totalItems: number,
    renderItem: (index: number) => HTMLElement
  ) {
    const visibleItems = Math.ceil(container.clientHeight / itemHeight);
    const buffer = Math.ceil(visibleItems / 2);

    let startIndex = 0;
    let endIndex = Math.min(startIndex + visibleItems + buffer, totalItems);

    const updateVisibleItems = () => {
      const scrollTop = container.scrollTop;
      const newStartIndex = Math.floor(scrollTop / itemHeight);
      const newEndIndex = Math.min(
        newStartIndex + visibleItems + buffer,
        totalItems
      );

      if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
        startIndex = newStartIndex;
        endIndex = newEndIndex;

        // Clear container
        container.innerHTML = "";

        // Add spacer for items before visible range
        if (startIndex > 0) {
          const spacer = document.createElement("div");
          spacer.style.height = `${startIndex * itemHeight}px`;
          container.appendChild(spacer);
        }

        // Render visible items
        for (let i = startIndex; i < endIndex; i++) {
          const item = renderItem(i);
          item.style.position = "absolute";
          item.style.top = `${i * itemHeight}px`;
          item.style.height = `${itemHeight}px`;
          container.appendChild(item);
        }

        // Add spacer for items after visible range
        if (endIndex < totalItems) {
          const spacer = document.createElement("div");
          spacer.style.height = `${(totalItems - endIndex) * itemHeight}px`;
          container.appendChild(spacer);
        }
      }
    };

    // Initial render
    updateVisibleItems();

    // Add scroll listener
    container.addEventListener("scroll", updateVisibleItems);

    return () => container.removeEventListener("scroll", updateVisibleItems);
  }

  // Performance monitoring
  static measurePerformance(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  }

  // Memory usage monitoring
  static getMemoryUsage() {
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  // Cleanup unused resources
  static cleanup() {
    // Clear any pending timeouts
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }

    // Clear any pending intervals
    const highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }

    // Force garbage collection if available
    if ("gc" in window) {
      (window as any).gc();
    }
  }
}
