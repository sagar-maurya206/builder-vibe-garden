import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  CheckCircle,
  Factory,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  KaizenIdGenerator,
  ImageCompressionService,
  OrganizationService,
  FormValidationService,
  ApprovalWorkflowService,
} from "../utils/services";

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
    operatorName: "",
    department: "",
    plant: "",
    kaizenTitle: "",
    description: "",
    expectedBenefits: "",
    financialImpact: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const departments = OrganizationService.getDepartments(language);
  const plants = OrganizationService.getPlants(language);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      const compressed = await ImageCompressionService.compressImage(
        file,
        3,
        0.8,
      );
      setCompressedImage(compressed);
      setFormData((prev) => ({ ...prev, image: compressed }));

      console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(
        `Compressed size: ${(compressed.size / 1024 / 1024).toFixed(2)}MB`,
      );
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Failed to process image. Please try again.");
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
    setFormData((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = FormValidationService.validateKaizenForm({
      ...formData,
      financialImpact: Number(formData.financialImpact),
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
      status: "Pending",
      approvalLevel: formData.financialImpact
        ? ApprovalWorkflowService.getApprovalLevel(
            Number(formData.financialImpact),
          )
        : "Plant Head",
    };

    // Here you would typically send the data to your backend
    console.log("Submitting Kaizen:", submissionData);

    // Show success state
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setFormData({
      operatorName: "",
      department: "",
      plant: "",
      kaizenTitle: "",
      description: "",
      expectedBenefits: "",
      financialImpact: "",
    });
    removeImage();
    setIsSubmitted(false);
    setSubmissionId("");
    setErrors([]);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md professional-card">
          <CardHeader className="text-center border-b border-slate-100 pb-6">
            <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-md">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-700 mb-2">
              {t("success.title")}
            </CardTitle>
            <CardDescription className="text-slate-600 font-medium">
              {t("success.message")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6 pt-6">
            <Alert className="border-emerald-200 bg-emerald-50">
              <AlertDescription className="text-emerald-800">
                <div className="font-semibold mb-2">
                  {t("success.referenceId")}
                </div>
                <code className="bg-white px-3 py-2 rounded-lg text-lg font-mono shadow-sm border border-emerald-200 text-emerald-800">
                  {submissionId}
                </code>
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleClear}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
            >
              Submit Another Idea
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="professional-card">
          <CardHeader className="text-center border-b border-slate-100 pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Factory className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
              {t("form.title")}
            </CardTitle>
            <CardDescription className="text-slate-600 font-medium text-lg">
              Share your improvement ideas to make our workplace better
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            {/* Error Display */}
            {errors.length > 0 && (
              <Alert className="mb-8 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  <div className="font-semibold mb-3 text-red-800">
                    Please fix the following errors:
                  </div>
                  <ul className="list-disc list-inside space-y-2">
                    {errors.map((error, index) => (
                      <li key={index} className="font-medium">
                        {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="operatorName"
                      className="text-sm font-semibold text-slate-700"
                    >
                      {t("form.operatorName")} *
                    </Label>
                    <Input
                      id="operatorName"
                      type="text"
                      placeholder={t("form.operatorName.placeholder")}
                      value={formData.operatorName}
                      onChange={(e) =>
                        handleInputChange("operatorName", e.target.value)
                      }
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 professional-input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="department"
                      className="text-sm font-semibold text-slate-700"
                    >
                      {t("form.department")} *
                    </Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        handleInputChange("department", value)
                      }
                      required
                    >
                      <SelectTrigger className="border-slate-300 hover:border-slate-400">
                        <SelectValue
                          placeholder={t("form.department.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent className="border-slate-200">
                        {departments.map((dept) => (
                          <SelectItem
                            key={dept.value}
                            value={dept.value}
                            className="hover:bg-slate-50"
                          >
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="plant"
                  className="text-sm font-semibold text-slate-700"
                >
                  {t("form.plant")} *
                </Label>
                <Select
                  value={formData.plant}
                  onValueChange={(value) => handleInputChange("plant", value)}
                  required
                >
                  <SelectTrigger className="border-slate-300 hover:border-slate-400">
                    <SelectValue placeholder={t("form.plant.placeholder")} />
                  </SelectTrigger>
                  <SelectContent className="border-slate-200">
                    {plants.map((plant) => (
                      <SelectItem
                        key={plant.value}
                        value={plant.value}
                        className="hover:bg-slate-50"
                      >
                        {plant.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kaizen Details */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Kaizen Details
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="kaizenTitle"
                      className="text-sm font-semibold text-slate-700"
                    >
                      {t("form.kaizenTitle")} *
                    </Label>
                    <Input
                      id="kaizenTitle"
                      type="text"
                      placeholder={t("form.kaizenTitle.placeholder")}
                      value={formData.kaizenTitle}
                      onChange={(e) =>
                        handleInputChange("kaizenTitle", e.target.value)
                      }
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 professional-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold text-slate-700"
                    >
                      {t("form.description")} *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder={t("form.description.placeholder")}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 professional-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="expectedBenefits"
                      className="text-sm font-semibold text-slate-700"
                    >
                      {t("form.expectedBenefits")} *
                    </Label>
                    <Textarea
                      id="expectedBenefits"
                      placeholder={t("form.expectedBenefits.placeholder")}
                      value={formData.expectedBenefits}
                      onChange={(e) =>
                        handleInputChange("expectedBenefits", e.target.value)
                      }
                      rows={3}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 professional-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="financialImpact"
                      className="text-sm font-semibold text-slate-700"
                    >
                      {t("form.financialImpact")} *
                    </Label>
                    <Input
                      id="financialImpact"
                      type="number"
                      placeholder={t("form.financialImpact.placeholder")}
                      value={formData.financialImpact}
                      onChange={(e) =>
                        handleInputChange("financialImpact", e.target.value)
                      }
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 professional-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label
                  htmlFor="image"
                  className="text-sm font-semibold text-slate-700"
                >
                  {t("form.uploadImage")}
                </Label>

                {!selectedImage ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-slate-500">
                        {t("form.uploadImage.hint")}
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                    <div className="flex items-start space-x-6">
                      {imagePreview && (
                        <div className="flex-shrink-0">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {selectedImage.name}
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeImage}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs text-slate-600 font-medium">
                            Original:{" "}
                            {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>

                          {isCompressing && (
                            <p className="text-xs text-blue-600 font-medium">
                              <span className="inline-block animate-spin mr-2">
                                ⟳
                              </span>
                              Compressing image...
                            </p>
                          )}

                          {compressedImage && !isCompressing && (
                            <p className="text-xs text-emerald-600 font-medium">
                              ✓ Compressed:{" "}
                              {(compressedImage.size / 1024 / 1024).toFixed(2)}{" "}
                              MB
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
                  disabled={isCompressing}
                >
                  {isCompressing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Image...
                    </>
                  ) : (
                    t("button.submit")
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg"
                  disabled={isCompressing}
                >
                  {t("button.clear")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
