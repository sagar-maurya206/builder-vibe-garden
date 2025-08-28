import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600">Global Kaizen management with approval workflows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Submissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Needs workflow approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">≤₹1L (Plant Head)</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Plant head approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">₹1-3L (Operations)</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Operations head approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">₹3-10L (Finance)</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Finance head approval</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>
                Financial threshold-based approval system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">≤ ₹1 lakh</span>
                  <span className="text-sm text-green-600">Plant Head Approval</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">₹1-3 lakhs</span>
                  <span className="text-sm text-blue-600">Operations Head Approval</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">₹3-10 lakhs</span>
                  <span className="text-sm text-purple-600">Financial Head Approval</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Preview</CardTitle>
              <CardDescription>
                Pending vs Approved submissions by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Production</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">5 pending</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">12 approved</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">3 pending</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">8 approved</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maintenance</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">2 pending</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">6 approved</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Super Admin Dashboard Under Development</CardTitle>
            <CardDescription>
              This dashboard will include global submission management, approval workflows, 
              analytics, and comprehensive reporting features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Features being implemented:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Global submission management with filters</li>
                <li>Workflow-based approval system (Plant/Operations/Finance Head)</li>
                <li>Comprehensive analytics and charts</li>
                <li>Excel/PDF report generation</li>
                <li>Multi-plant comparison dashboards</li>
                <li>Financial impact tracking</li>
              </ul>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                Continue Implementation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
