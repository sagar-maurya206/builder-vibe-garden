import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  BarChart3, 
  Settings, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Edit3,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';

// Mock data for demonstrations
interface Submission {
  id: string;
  operatorName: string;
  department: string;
  plant: string;
  title: string;
  description: string;
  expectedBenefits: string;
  financialImpact: number;
  submissionDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  lastEditDate?: Date;
  editedBy?: string;
}

const mockSubmissions: Submission[] = [
  {
    id: 'KZ-LMN123-ABC45',
    operatorName: 'Rajesh Kumar',
    department: 'Production',
    plant: 'Pune',
    title: 'Reduce waste in assembly line',
    description: 'Implement lean manufacturing principles to reduce material waste by 15%',
    expectedBenefits: 'Cost savings, environmental impact reduction, improved efficiency',
    financialImpact: 75000,
    submissionDate: new Date('2024-01-15'),
    status: 'Pending'
  },
  {
    id: 'KZ-XYZ789-DEF67',
    operatorName: 'Priya Sharma',
    department: 'Quality',
    plant: 'Aurangabad',
    title: 'Automated quality inspection',
    description: 'Install vision systems for automatic defect detection',
    expectedBenefits: 'Higher accuracy, faster inspection, reduced human error',
    financialImpact: 120000,
    submissionDate: new Date('2024-01-10'),
    status: 'Approved'
  },
  {
    id: 'KZ-PQR456-GHI89',
    operatorName: 'Amit Patel',
    department: 'Maintenance',
    plant: 'Pune',
    title: 'Predictive maintenance system',
    description: 'Implement IoT sensors for equipment monitoring',
    expectedBenefits: 'Reduced downtime, proactive maintenance, cost savings',
    financialImpact: 200000,
    submissionDate: new Date('2024-01-08'),
    status: 'Pending'
  },
  {
    id: 'KZ-STU012-JKL34',
    operatorName: 'Sunita Devi',
    department: 'Production',
    plant: 'Chennai',
    title: 'Energy efficient lighting',
    description: 'Replace conventional lights with LED systems',
    expectedBenefits: 'Energy savings, longer lifespan, better illumination',
    financialImpact: 45000,
    submissionDate: new Date('2024-01-05'),
    status: 'Approved'
  },
  {
    id: 'KZ-VWX345-MNO56',
    operatorName: 'Vikram Singh',
    department: 'Engineering',
    plant: 'Nashik',
    title: 'Optimize conveyor belt speed',
    description: 'Adjust conveyor speeds based on production demand',
    expectedBenefits: 'Energy savings, improved throughput, reduced wear',
    financialImpact: 60000,
    submissionDate: new Date('2023-12-20'),
    status: 'Pending'
  }
];

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submissions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [plantFilter, setPlantFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Simulate logged-in admin's department
  const adminDepartment = 'Production'; // This would come from auth context

  // Filter submissions based on admin's department and filters
  const filteredSubmissions = useMemo(() => {
    return mockSubmissions
      .filter(submission => submission.department === adminDepartment)
      .filter(submission => {
        if (searchTerm) {
          return submission.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 submission.id.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      })
      .filter(submission => {
        if (statusFilter !== 'All') {
          return submission.status === statusFilter;
        }
        return true;
      })
      .filter(submission => {
        if (plantFilter !== 'All') {
          return submission.plant === plantFilter;
        }
        return true;
      })
      .filter(submission => {
        if (dateFilter !== 'All') {
          const now = new Date();
          const submissionDate = submission.submissionDate;
          
          switch (dateFilter) {
            case 'Last 7 days':
              return (now.getTime() - submissionDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
            case 'Last 30 days':
              return (now.getTime() - submissionDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
            case 'Last 90 days':
              return (now.getTime() - submissionDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
            default:
              return true;
          }
        }
        return true;
      });
  }, [searchTerm, statusFilter, plantFilter, dateFilter, adminDepartment]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const departmentSubmissions = mockSubmissions.filter(s => s.department === adminDepartment);
    const totalSubmissions = departmentSubmissions.length;
    const pendingSubmissions = departmentSubmissions.filter(s => s.status === 'Pending').length;
    const approvedSubmissions = departmentSubmissions.filter(s => s.status === 'Approved').length;
    const totalFinancialImpact = departmentSubmissions.reduce((sum, s) => sum + s.financialImpact, 0);
    
    return {
      total: totalSubmissions,
      pending: pendingSubmissions,
      approved: approvedSubmissions,
      financialImpact: totalFinancialImpact
    };
  }, [adminDepartment]);

  const canEditSubmission = (submissionDate: Date) => {
    const daysSinceSubmission = (Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceSubmission <= 30;
  };

  const handleEdit = (id: string) => {
    console.log('Edit submission:', id);
    // Navigate to edit page
    alert(`Navigate to edit page for submission: ${id}`);
  };

  const handleExportExcel = () => {
    console.log('Export to Excel');
    alert('Excel export functionality will be implemented');
  };

  const handleExportPDF = () => {
    console.log('Export to PDF');
    alert('PDF export functionality will be implemented');
  };

  const handlePrintForm = (id: string) => {
    console.log('Print Kaizen form:', id);
    alert(`Print Kaizen form for submission: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Department: <strong>{adminDepartment}</strong> • Kaizen submissions management</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total}</div>
              <p className="text-xs text-muted-foreground">Department submissions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.approved}</div>
              <p className="text-xs text-muted-foreground">{metrics.total > 0 ? Math.round((metrics.approved / metrics.total) * 100) : 0}% approval rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Financial Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(metrics.financialImpact / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">Total estimated savings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Submissions</CardTitle>
                <CardDescription>
                  Manage and review Kaizen submissions from your department
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, title, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plant">Plant</Label>
                    <Select value={plantFilter} onValueChange={setPlantFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Plants</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Aurangabad">Aurangabad</SelectItem>
                        <SelectItem value="Nashik">Nashik</SelectItem>
                        <SelectItem value="Chennai">Chennai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Time</SelectItem>
                        <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                        <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                        <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unique ID</TableHead>
                        <TableHead>Operator Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Plant</TableHead>
                        <TableHead>Financial Impact</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                          <TableCell className="font-medium">{submission.operatorName}</TableCell>
                          <TableCell className="max-w-xs truncate">{submission.title}</TableCell>
                          <TableCell>{submission.plant}</TableCell>
                          <TableCell>₹{submission.financialImpact.toLocaleString()}</TableCell>
                          <TableCell>{submission.submissionDate.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                              submission.status === 'Approved' ? 'default' :
                              submission.status === 'Pending' ? 'secondary' : 'destructive'
                            }>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {canEditSubmission(submission.submissionDate) ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(submission.id)}
                                >
                                  <Edit3 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" disabled>
                                  <Edit3 className="w-4 h-4 mr-1" />
                                  Edit (30+ days)
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No submissions found matching your filters.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approved Submissions</CardTitle>
                <CardDescription>
                  View-only access to approved Kaizen submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>Approved submissions view - Read-only access</p>
                  <p className="text-sm">This section shows approved Kaizen ideas for reference</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Reports</CardTitle>
                <CardDescription>
                  Generate and export department-level reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Export Options</h4>
                    <div className="space-y-3">
                      <Button onClick={handleExportExcel} className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export to Excel
                      </Button>
                      <Button onClick={handleExportPDF} variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export to PDF
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Print Options</h4>
                    <div className="space-y-3">
                      <Button onClick={() => handlePrintForm('selected')} variant="outline" className="w-full justify-start">
                        <Printer className="w-4 h-4 mr-2" />
                        Print Selected Forms
                      </Button>
                      <Button onClick={() => handlePrintForm('all')} variant="outline" className="w-full justify-start">
                        <Printer className="w-4 h-4 mr-2" />
                        Print All Department Forms
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Report Features</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Department-specific submission summaries</li>
                    <li>• Financial impact analysis</li>
                    <li>• Status breakdown and trends</li>
                    <li>• Operator performance metrics</li>
                    <li>• Custom date range filtering</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
