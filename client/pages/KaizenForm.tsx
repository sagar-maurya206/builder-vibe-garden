import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, Factory, Image as ImageIcon, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  KaizenIdGenerator,
  ImageCompressionService,
  OrganizationService,
  FormValidationService,
  ApprovalWorkflowService
} from '../utils/services';

interface FormData {
  operatorName: string;
  department: string;
  plant: string;
  kaizenTitle: string;
  description: string;
  expectedBenefits: string;
  financialImpact: string;
  image?: File;
}

export default function KaizenForm() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    operatorName: '',
    department: '',
    plant: '',
    kaizenTitle: '',
    description: '',
    expectedBenefits: '',
    financialImpact: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const departments = OrganizationService.getDepartments(language);
  const plants = OrganizationService.getPlants(language);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    const validation = ImageCompressionService.validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setSelectedImage(file);
    setIsCompressing(true);

    try {
      // Generate preview
      const preview = ImageCompressionService.getImagePreview(file);
      setImagePreview(preview);

      // Compress image
      const compressed = await ImageCompressionService.compressImage(file, 3, 0.8);
      setCompressedImage(compressed);
      setFormData(prev => ({ ...prev, image: compressed }));

      console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Compressed size: ${(compressed.size / 1024 / 1024).toFixed(2)}MB`);
    } catch (error) {
      console.error('Image compression failed:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setCompressedImage(null);
    if (imagePreview) {
      ImageCompressionService.cleanupPreview(imagePreview);
      setImagePreview(null);
    }
    setFormData(prev => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = FormValidationService.validateKaizenForm({
      ...formData,
      financialImpact: Number(formData.financialImpact)
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Generate unique ID
    const uniqueId = KaizenIdGenerator.generateId();
    setSubmissionId(uniqueId);

    // Prepare submission data
    const submissionData = {
      id: uniqueId,
      ...formData,
      financialImpact: Number(formData.financialImpact),
      submissionDate: new Date(),
      image: compressedImage,
      status: 'Pending',
      approvalLevel: formData.financialImpact ?
        ApprovalWorkflowService.getApprovalLevel(Number(formData.financialImpact)) :
        'Plant Head'
    };

    // Here you would typically send the data to your backend
    console.log('Submitting Kaizen:', submissionData);

    // Show success state
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setFormData({
      operatorName: '',
      department: '',
      plant: '',
      kaizenTitle: '',
      description: '',
      expectedBenefits: '',
      financialImpact: '',
    });
    removeImage();
    setIsSubmitted(false);
    setSubmissionId('');
    setErrors([]);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              {t('success.title')}
            </CardTitle>
            <CardDescription>
              {t('success.message')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert>
              <AlertDescription>
                <strong>{t('success.referenceId')}</strong><br />
                <code className="bg-gray-100 px-2 py-1 rounded text-lg font-mono">
                  {submissionId}
                </code>
              </AlertDescription>
            </Alert>
            <Button onClick={handleClear} className="w-full">
              Submit Another Idea
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Factory className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {t('form.title')}
            </CardTitle>
            <CardDescription>
              Share your improvement ideas to make our workplace better
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Display */}
            {errors.length > 0 && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  <div className="font-medium mb-2">Please fix the following errors:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operatorName">{t('form.operatorName')} *</Label>
                  <Input
                    id="operatorName"
                    type="text"
                    placeholder={t('form.operatorName.placeholder')}
                    value={formData.operatorName}
                    onChange={(e) => handleInputChange('operatorName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{t('form.department')} *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.department.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plant">{t('form.plant')} *</Label>
                <Select value={formData.plant} onValueChange={(value) => handleInputChange('plant', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.plant.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {plants.map((plant) => (
                      <SelectItem key={plant.value} value={plant.value}>
                        {plant.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kaizen Details */}
              <div className="space-y-2">
                <Label htmlFor="kaizenTitle">{t('form.kaizenTitle')} *</Label>
                <Input
                  id="kaizenTitle"
                  type="text"
                  placeholder={t('form.kaizenTitle.placeholder')}
                  value={formData.kaizenTitle}
                  onChange={(e) => handleInputChange('kaizenTitle', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('form.description')} *</Label>
                <Textarea
                  id="description"
                  placeholder={t('form.description.placeholder')}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedBenefits">{t('form.expectedBenefits')} *</Label>
                <Textarea
                  id="expectedBenefits"
                  placeholder={t('form.expectedBenefits.placeholder')}
                  value={formData.expectedBenefits}
                  onChange={(e) => handleInputChange('expectedBenefits', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financialImpact">{t('form.financialImpact')} *</Label>
                <Input
                  id="financialImpact"
                  type="number"
                  placeholder={t('form.financialImpact.placeholder')}
                  value={formData.financialImpact}
                  onChange={(e) => handleInputChange('financialImpact', e.target.value)}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">{t('form.uploadImage')}</Label>

                {!selectedImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t('form.uploadImage.hint')}
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-4">
                      {imagePreview && (
                        <div className="flex-shrink-0">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedImage.name}
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeImage}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="mt-1 space-y-1">
                          <p className="text-xs text-gray-500">
                            Original: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>

                          {isCompressing && (
                            <p className="text-xs text-blue-600">
                              <span className="inline-block animate-spin mr-1">⟳</span>
                              Compressing image...
                            </p>
                          )}

                          {compressedImage && !isCompressing && (
                            <p className="text-xs text-green-600">
                              ✓ Compressed: {(compressedImage.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {t('button.submit')}
                </Button>
                <Button type="button" variant="outline" onClick={handleClear} className="flex-1">
                  {t('button.clear')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
