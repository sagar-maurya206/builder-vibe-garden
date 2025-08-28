import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import AnalyticsCharts from '../components/AnalyticsCharts';
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
    navigate(`/edit-submission/${id}`);
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Department: <span className="font-semibold text-slate-700">{adminDepartment}</span> • Kaizen submissions management</p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="professional-card border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Total Submissions</CardTitle>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">{metrics.total}</div>
              <p className="text-sm text-slate-500 font-medium">Department submissions</p>
            </CardContent>
          </Card>

          <Card className="professional-card border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Pending Review</CardTitle>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">{metrics.pending}</div>
              <p className="text-sm text-slate-500 font-medium">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className="professional-card border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Approved</CardTitle>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">{metrics.approved}</div>
              <p className="text-sm text-slate-500 font-medium">{metrics.total > 0 ? Math.round((metrics.approved / metrics.total) * 100) : 0}% approval rate</p>
            </CardContent>
          </Card>

          <Card className="professional-card border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Financial Impact</CardTitle>
              <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">₹{(metrics.financialImpact / 100000).toFixed(1)}L</div>
              <p className="text-sm text-slate-500 font-medium">Total estimated savings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 border border-slate-200 rounded-xl p-1">
            <TabsTrigger value="submissions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Submissions</TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Approved</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Analytics</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Reports</TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6 mt-6">
            <Card className="professional-card">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-xl text-slate-800">Department Submissions</CardTitle>
                <CardDescription className="text-slate-600">
                  Manage and review Kaizen submissions from your department
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-2">
                    <Label htmlFor="search" className="text-sm font-semibold text-slate-700">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, title, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 professional-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-semibold text-slate-700">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="border-slate-300 hover:border-slate-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-slate-200">
                        <SelectItem value="All" className="hover:bg-slate-50">All Statuses</SelectItem>
                        <SelectItem value="Pending" className="hover:bg-slate-50">Pending</SelectItem>
                        <SelectItem value="Approved" className="hover:bg-slate-50">Approved</SelectItem>
                        <SelectItem value="Rejected" className="hover:bg-slate-50">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plant" className="text-sm font-semibold text-slate-700">Plant</Label>
                    <Select value={plantFilter} onValueChange={setPlantFilter}>
                      <SelectTrigger className="border-slate-300 hover:border-slate-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-slate-200">
                        <SelectItem value="All" className="hover:bg-slate-50">All Plants</SelectItem>
                        <SelectItem value="Pune" className="hover:bg-slate-50">Pune</SelectItem>
                        <SelectItem value="Aurangabad" className="hover:bg-slate-50">Aurangabad</SelectItem>
                        <SelectItem value="Nashik" className="hover:bg-slate-50">Nashik</SelectItem>
                        <SelectItem value="Chennai" className="hover:bg-slate-50">Chennai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-semibold text-slate-700">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="border-slate-300 hover:border-slate-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-slate-200">
                        <SelectItem value="All" className="hover:bg-slate-50">All Time</SelectItem>
                        <SelectItem value="Last 7 days" className="hover:bg-slate-50">Last 7 days</SelectItem>
                        <SelectItem value="Last 30 days" className="hover:bg-slate-50">Last 30 days</SelectItem>
                        <SelectItem value="Last 90 days" className="hover:bg-slate-50">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="professional-table">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-200">
                        <TableHead className="font-semibold text-slate-700 py-4">Unique ID</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Operator Name</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Title</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Plant</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Financial Impact</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Submission Date</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id} className="hover:bg-slate-50/80 border-b border-slate-100">
                          <TableCell className="font-mono text-sm text-slate-600 py-4">{submission.id}</TableCell>
                          <TableCell className="font-semibold text-slate-800 py-4">{submission.operatorName}</TableCell>
                          <TableCell className="max-w-xs truncate text-slate-700 py-4">{submission.title}</TableCell>
                          <TableCell className="text-slate-600 py-4">{submission.plant}</TableCell>
                          <TableCell className="font-semibold text-slate-800 py-4">₹{submission.financialImpact.toLocaleString()}</TableCell>
                          <TableCell className="text-slate-600 py-4">{submission.submissionDate.toLocaleDateString()}</TableCell>
                          <TableCell className="py-4">
                            <Badge className={
                              submission.status === 'Approved' ? 'status-approved' :
                              submission.status === 'Pending' ? 'status-pending' : 'status-rejected'
                            }>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex space-x-2">
                              {canEditSubmission(submission.submissionDate) ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(submission.id)}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-medium"
                                >
                                  <Edit3 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled
                                  className="opacity-50 cursor-not-allowed border-slate-200 text-slate-400"
                                >
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
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium">No submissions found</p>
                    <p className="text-sm">Try adjusting your filters to see more results.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved" className="space-y-6 mt-6">
            <Card className="professional-card">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-xl text-slate-800">Approved Submissions</CardTitle>
                <CardDescription className="text-slate-600">
                  View-only access to approved Kaizen submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Approved Submissions</h3>
                  <p className="text-slate-600 mb-1">View-only access to approved Kaizen ideas</p>
                  <p className="text-sm text-slate-500">This section shows approved submissions for reference and learning</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <AnalyticsCharts
              submissions={mockSubmissions.filter(s => s.department === adminDepartment)}
              title={`${adminDepartment} Department Analytics`}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6 mt-6">
            <Card className="professional-card">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-xl text-slate-800">Department Reports</CardTitle>
                <CardDescription className="text-slate-600">
                  Generate and export department-level reports
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Export Options
                    </h4>
                    <div className="space-y-3">
                      <Button
                        onClick={handleExportExcel}
                        className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export to Excel
                      </Button>
                      <Button
                        onClick={handleExportPDF}
                        variant="outline"
                        className="w-full justify-start border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export to PDF
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 flex items-center">
                      <Printer className="w-4 h-4 mr-2" />
                      Print Options
                    </h4>
                    <div className="space-y-3">
                      <Button
                        onClick={() => handlePrintForm('selected')}
                        variant="outline"
                        className="w-full justify-start border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Selected Forms
                      </Button>
                      <Button
                        onClick={() => handlePrintForm('all')}
                        variant="outline"
                        className="w-full justify-start border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print All Department Forms
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
                  <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Report Features
                  </h5>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Department-specific submission summaries
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Financial impact analysis
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Status breakdown and trends
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Operator performance metrics
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Custom date range filtering
                    </li>
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
