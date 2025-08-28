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
  FormValidationService
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

  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `KZ-${timestamp}-${random}`.toUpperCase();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (3MB limit)
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be less than 3MB');
        return;
      }
      setSelectedImage(file);
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate unique ID
    const uniqueId = generateUniqueId();
    setSubmissionId(uniqueId);
    
    // Here you would typically send the data to your backend
    console.log('Submitting Kaizen:', { ...formData, id: uniqueId });
    
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
    setSelectedImage(null);
    setIsSubmitted(false);
    setSubmissionId('');
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
                      {selectedImage ? selectedImage.name : 'Click to upload an image'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('form.uploadImage.hint')}
                    </p>
                  </label>
                </div>
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
