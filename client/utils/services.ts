/**
 * Utility Services for Kaizen Application
 * Includes ID generation, image compression, and other utilities
 */

// Unique ID Generation Service
export class KaizenIdGenerator {
  private static counter = 0;
  
  /**
   * Generate a unique Kaizen ID with format: KZ-{timestamp}-{random}
   * Example: KZ-LMN123-ABC45
   */
  static generateId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.counter++;
    
    // Ensure uniqueness with counter
    const counterId = this.counter.toString(36).toUpperCase().padStart(3, '0');
    
    return `KZ-${timestamp}-${counterId}${random}`;
  }
  
  /**
   * Validate Kaizen ID format
   */
  static validateId(id: string): boolean {
    const kaizenIdPattern = /^KZ-[A-Z0-9]+-[A-Z0-9]+$/;
    return kaizenIdPattern.test(id);
  }
  
  /**
   * Extract timestamp from Kaizen ID
   */
  static extractTimestamp(id: string): Date | null {
    try {
      const parts = id.split('-');
      if (parts.length >= 2) {
        const timestamp = parseInt(parts[1], 36);
        return new Date(timestamp);
      }
    } catch (error) {
      console.error('Error extracting timestamp from ID:', error);
    }
    return null;
  }
}

// Image Compression Service
export class ImageCompressionService {
  /**
   * Compress image to under 3MB while maintaining quality
   */
  static async compressImage(file: File, maxSizeMB: number = 3, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        const maxDimension = 1920; // Max width/height
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              
              // Check if still too large, reduce quality further
              if (compressedFile.size > maxSizeMB * 1024 * 1024 && quality > 0.1) {
                this.compressImage(file, maxSizeMB, quality - 0.1)
                  .then(resolve)
                  .catch(reject);
              } else {
                resolve(compressedFile);
              }
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
  
  /**
   * Validate image file
   */
  static validateImage(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB before compression
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'Image size must be less than 10MB' };
    }
    
    return { valid: true };
  }
  
  /**
   * Get image preview URL
   */
  static getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }
  
  /**
   * Clean up preview URL
   */
  static cleanupPreview(url: string): void {
    URL.revokeObjectURL(url);
  }
}

// Department and Plant Management
export class OrganizationService {
  static readonly DEPARTMENTS = [
    { id: 'production', name: 'Production', nameHi: 'उत्पादन' },
    { id: 'quality', name: 'Quality', nameHi: 'गुणवत्ता' },
    { id: 'maintenance', name: 'Maintenance', nameHi: 'रखरखाव' },
    { id: 'engineering', name: 'Engineering', nameHi: 'इंजीनियरिंग' },
    { id: 'hr', name: 'Human Resources', nameHi: 'मानव संसाधन' },
    { id: 'finance', name: 'Finance', nameHi: 'वि���्त' },
  ];
  
  static readonly PLANTS = [
    { id: 'pune', name: 'Pune', nameHi: 'पुणे' },
    { id: 'aurangabad', name: 'Aurangabad', nameHi: 'औरंगाबाद' },
    { id: 'nashik', name: 'Nashik', nameHi: 'नासिक' },
    { id: 'chennai', name: 'Chennai', nameHi: 'चेन्नई' },
  ];
  
  static getDepartments(language: 'en' | 'hi' = 'en') {
    return this.DEPARTMENTS.map(dept => ({
      value: dept.id,
      label: language === 'hi' ? dept.nameHi : dept.name
    }));
  }
  
  static getPlants(language: 'en' | 'hi' = 'en') {
    return this.PLANTS.map(plant => ({
      value: plant.id,
      label: language === 'hi' ? plant.nameHi : plant.name
    }));
  }
}

// Approval Workflow Service
export class ApprovalWorkflowService {
  /**
   * Determine approval level based on financial impact
   */
  static getApprovalLevel(financialImpact: number): 'Plant Head' | 'Operations Head' | 'Finance Head' {
    if (financialImpact <= 100000) {
      return 'Plant Head';
    } else if (financialImpact <= 300000) {
      return 'Operations Head';
    } else {
      return 'Finance Head';
    }
  }
  
  /**
   * Get approval level color for UI
   */
  static getApprovalLevelColor(level: string): string {
    switch (level) {
      case 'Plant Head':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Operations Head':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Finance Head':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
  
  /**
   * Get financial threshold description
   */
  static getThresholdDescription(level: string): string {
    switch (level) {
      case 'Plant Head':
        return '≤ ₹1 lakh';
      case 'Operations Head':
        return '₹1-3 lakhs';
      case 'Finance Head':
        return '₹3-10 lakhs';
      default:
        return 'Unknown range';
    }
  }
}

// Form Validation Service
export class FormValidationService {
  /**
   * Validate Kaizen submission form
   */
  static validateKaizenForm(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.operatorName?.trim()) {
      errors.push('Operator name is required');
    }
    
    if (!data.department) {
      errors.push('Department is required');
    }
    
    if (!data.plant) {
      errors.push('Plant is required');
    }
    
    if (!data.kaizenTitle?.trim()) {
      errors.push('Kaizen title is required');
    }
    
    if (!data.description?.trim()) {
      errors.push('Description is required');
    }
    
    if (!data.expectedBenefits?.trim()) {
      errors.push('Expected benefits are required');
    }
    
    if (!data.financialImpact || data.financialImpact <= 0) {
      errors.push('Financial impact must be greater than 0');
    }
    
    if (data.financialImpact > 10000000) { // 1 crore limit
      errors.push('Financial impact cannot exceed ₹1 crore');
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  /**
   * Sanitize form input
   */
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>\"']/g, '');
  }
}

// Date and Time Utilities
export class DateTimeService {
  /**
   * Format date for display
   */
  static formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
    if (format === 'long') {
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('en-IN');
  }
  
  /**
   * Check if date is within edit period (30 days)
   */
  static isWithinEditPeriod(submissionDate: Date): boolean {
    const daysSinceSubmission = (Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceSubmission <= 30;
  }
  
  /**
   * Get days since submission
   */
  static getDaysSinceSubmission(submissionDate: Date): number {
    return Math.floor((Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  /**
   * Get relative time description
   */
  static getRelativeTime(date: Date): string {
    const days = this.getDaysSinceSubmission(date);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }
}

// Export Management Service
export class ExportService {
  /**
   * Export data to CSV format
   */
  static exportToCSV(data: any[], filename: string = 'kaizen-export.csv'): void {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  /**
   * Convert data to CSV format
   */
  private static convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }
  
  /**
   * Generate printable HTML for Kaizen form
   */
  static generatePrintableForm(submission: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kaizen Form - ${submission.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; }
          .value { margin-left: 10px; }
          .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature-box { border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>JBM Kaizen Improvement Form</h2>
          <p>ID: ${submission.id}</p>
        </div>
        
        <div class="field">
          <span class="label">Operator Name:</span>
          <span class="value">${submission.operatorName}</span>
        </div>
        
        <div class="field">
          <span class="label">Department:</span>
          <span class="value">${submission.department}</span>
        </div>
        
        <div class="field">
          <span class="label">Plant:</span>
          <span class="value">${submission.plant}</span>
        </div>
        
        <div class="field">
          <span class="label">Title:</span>
          <span class="value">${submission.title}</span>
        </div>
        
        <div class="field">
          <span class="label">Description:</span>
          <div class="value">${submission.description}</div>
        </div>
        
        <div class="field">
          <span class="label">Expected Benefits:</span>
          <div class="value">${submission.expectedBenefits}</div>
        </div>
        
        <div class="field">
          <span class="label">Financial Impact:</span>
          <span class="value">₹${submission.financialImpact?.toLocaleString()}</span>
        </div>
        
        <div class="field">
          <span class="label">Submission Date:</span>
          <span class="value">${submission.submissionDate ? new Date(submission.submissionDate).toLocaleDateString() : 'N/A'}</span>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">Operator Signature</div>
          <div class="signature-box">Supervisor Signature</div>
          <div class="signature-box">Approval Signature</div>
        </div>
      </body>
      </html>
    `;
  }
  
  /**
   * Print Kaizen form
   */
  static printKaizenForm(submission: any): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(this.generatePrintableForm(submission));
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }
}
