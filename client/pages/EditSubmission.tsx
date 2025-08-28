import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, AlertTriangle, Calendar } from "lucide-react";

// This would typically come from API/context
interface Submission {
  id: string;
  operatorName: string;
  department: string;
  plant: string;
  kaizenTitle: string;
  description: string;
  expectedBenefits: string;
  financialImpact: number;
  submissionDate: Date;
  lastEditDate?: Date;
  editedBy?: string;
}

export default function EditSubmission() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockSubmission: Submission = {
        id: id || "KZ-LMN123-ABC45",
        operatorName: "Rajesh Kumar",
        department: "Production",
        plant: "Pune",
        kaizenTitle: "Reduce waste in assembly line",
        description:
          "Implement lean manufacturing principles to reduce material waste by 15%",
        expectedBenefits:
          "Cost savings, environmental impact reduction, improved efficiency",
        financialImpact: 75000,
        submissionDate: new Date("2024-01-15"),
      };
      setFormData(mockSubmission);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const departments = [
    { value: "production", label: t("dept.production") },
    { value: "quality", label: t("dept.quality") },
    { value: "maintenance", label: t("dept.maintenance") },
    { value: "engineering", label: t("dept.engineering") },
    { value: "hr", label: t("dept.hr") },
    { value: "finance", label: t("dept.finance") },
  ];

  const plants = [
    { value: "pune", label: t("plant.pune") },
    { value: "aurangabad", label: t("plant.aurangabad") },
    { value: "nashik", label: t("plant.nashik") },
    { value: "chennai", label: t("plant.chennai") },
  ];

  const handleInputChange = (
    field: keyof Submission,
    value: string | number,
  ) => {
    if (!formData) return;

    setFormData((prev) => ({ ...prev!, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);

    // Simulate save API call
    setTimeout(() => {
      console.log("Saving submission:", formData);
      setHasChanges(false);
      setIsSaving(false);

      // Update edit history
      setFormData((prev) => ({
        ...prev!,
        lastEditDate: new Date(),
        editedBy: "Admin User",
      }));

      alert("Submission updated successfully!");
      navigate("/admin-dashboard");
    }, 1500);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        navigate("/admin-dashboard");
      }
    } else {
      navigate("/admin-dashboard");
    }
  };

  const canEdit = (submissionDate: Date) => {
    const daysSinceSubmission =
      (Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceSubmission <= 30;
  };

  const daysSinceSubmission = formData
    ? Math.floor(
        (Date.now() - formData.submissionDate.getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Submission Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The requested submission could not be found.
            </p>
            <Button onClick={() => navigate("/admin-dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={handleCancel} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Submission
              </h1>
              <p className="text-gray-600">ID: {formData.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Submitted: {formData.submissionDate.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {daysSinceSubmission} days ago
              </p>
            </div>
          </div>
        </div>

        {/* Edit Restrictions Alert */}
        {!canEdit(formData.submissionDate) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              This submission is older than 30 days and cannot be edited. Edit
              period has expired.
            </AlertDescription>
          </Alert>
        )}

        {/* Edit History */}
        {formData.lastEditDate && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Calendar className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Last edited by {formData.editedBy} on{" "}
              {formData.lastEditDate.toLocaleDateString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
            <CardDescription>
              Edit the submission details. Changes will be logged for audit
              purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operatorName">Operator Name *</Label>
                <Input
                  id="operatorName"
                  type="text"
                  value={formData.operatorName}
                  onChange={(e) =>
                    handleInputChange("operatorName", e.target.value)
                  }
                  disabled={!canEdit(formData.submissionDate)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department.toLowerCase()}
                  onValueChange={(value) =>
                    handleInputChange(
                      "department",
                      departments.find((d) => d.value === value)?.label ||
                        value,
                    )
                  }
                  disabled={!canEdit(formData.submissionDate)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              <Label htmlFor="plant">Plant *</Label>
              <Select
                value={formData.plant.toLowerCase()}
                onValueChange={(value) =>
                  handleInputChange(
                    "plant",
                    plants.find((p) => p.value === value)?.label || value,
                  )
                }
                disabled={!canEdit(formData.submissionDate)}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="kaizenTitle">Title of Kaizen *</Label>
              <Input
                id="kaizenTitle"
                type="text"
                value={formData.kaizenTitle}
                onChange={(e) =>
                  handleInputChange("kaizenTitle", e.target.value)
                }
                disabled={!canEdit(formData.submissionDate)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Idea *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                disabled={!canEdit(formData.submissionDate)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedBenefits">Expected Benefits *</Label>
              <Textarea
                id="expectedBenefits"
                value={formData.expectedBenefits}
                onChange={(e) =>
                  handleInputChange("expectedBenefits", e.target.value)
                }
                rows={3}
                disabled={!canEdit(formData.submissionDate)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialImpact">
                Estimated Financial Impact (₹) *
              </Label>
              <Input
                id="financialImpact"
                type="number"
                value={formData.financialImpact}
                onChange={(e) =>
                  handleInputChange("financialImpact", Number(e.target.value))
                }
                disabled={!canEdit(formData.submissionDate)}
              />
            </div>

            {/* Form Actions */}
            {canEdit(formData.submissionDate) && (
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="min-w-32"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}

            {!canEdit(formData.submissionDate) && (
              <div className="pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
