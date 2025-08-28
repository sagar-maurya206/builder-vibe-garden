import { useState, useMemo } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  BarChart3,
  PieChart,
  Calendar,
  Building,
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';

// Extended mock data for Super Admin view
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
  approvalLevel?: 'Plant Head' | 'Operations Head' | 'Finance Head';
  lastEditDate?: Date;
  editedBy?: string;
}

const mockAllSubmissions: Submission[] = [
  // Production Department
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
    status: 'Pending',
    approvalLevel: 'Plant Head'
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
    status: 'Approved',
    approvalLevel: 'Plant Head'
  },
  // Quality Department
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
    status: 'Pending',
    approvalLevel: 'Operations Head'
  },
  {
    id: 'KZ-QWE456-RTY78',
    operatorName: 'Anil Verma',
    department: 'Quality',
    plant: 'Pune',
    title: 'Statistical process control',
    description: 'Implement SPC charts for quality monitoring',
    expectedBenefits: 'Early defect detection, process optimization',
    financialImpact: 180000,
    submissionDate: new Date('2024-01-12'),
    status: 'Approved',
    approvalLevel: 'Operations Head'
  },
  // Maintenance Department
  {
    id: 'KZ-PQR456-GHI89',
    operatorName: 'Amit Patel',
    department: 'Maintenance',
    plant: 'Pune',
    title: 'Predictive maintenance system',
    description: 'Implement IoT sensors for equipment monitoring',
    expectedBenefits: 'Reduced downtime, proactive maintenance, cost savings',
    financialImpact: 250000,
    submissionDate: new Date('2024-01-08'),
    status: 'Pending',
    approvalLevel: 'Operations Head'
  },
  {
    id: 'KZ-ZXC789-VBN12',
    operatorName: 'Deepak Singh',
    department: 'Maintenance',
    plant: 'Nashik',
    title: 'Hydraulic system upgrade',
    description: 'Upgrade hydraulic systems for better efficiency',
    expectedBenefits: 'Energy savings, improved performance, reduced maintenance',
    financialImpact: 420000,
    submissionDate: new Date('2024-01-03'),
    status: 'Pending',
    approvalLevel: 'Finance Head'
  },
  // Engineering Department
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
    status: 'Approved',
    approvalLevel: 'Plant Head'
  },
  {
    id: 'KZ-ASD123-FGH45',
    operatorName: 'Neha Joshi',
    department: 'Engineering',
    plant: 'Chennai',
    title: 'CAD system optimization',
    description: 'Upgrade CAD software and hardware for faster processing',
    expectedBenefits: 'Faster design cycles, improved accuracy, better collaboration',
    financialImpact: 850000,
    submissionDate: new Date('2024-01-01'),
    status: 'Rejected',
    approvalLevel: 'Finance Head'
  },
  // HR Department
  {
    id: 'KZ-JKL678-QWE90',
    operatorName: 'Meera Gupta',
    department: 'HR',
    plant: 'Aurangabad',
    title: 'Digital training platform',
    description: 'Implement online training modules for skill development',
    expectedBenefits: 'Consistent training, cost reduction, better tracking',
    financialImpact: 150000,
    submissionDate: new Date('2024-01-14'),
    status: 'Pending',
    approvalLevel: 'Operations Head'
  },
  // Finance Department
  {
    id: 'KZ-POI123-UYT67',
    operatorName: 'Rahul Chopra',
    department: 'Finance',
    plant: 'Pune',
    title: 'Automated expense tracking',
    description: 'Implement digital expense management system',
    expectedBenefits: 'Reduced paperwork, faster approvals, better compliance',
    financialImpact: 95000,
    submissionDate: new Date('2024-01-16'),
    status: 'Approved',
    approvalLevel: 'Plant Head'
  }
];

export default function SuperAdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [plantFilter, setPlantFilter] = useState('All');
  const [amountRangeFilter, setAmountRangeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [approvalLevelFilter, setApprovalLevelFilter] = useState('All');

  // Filter submissions based on Super Admin filters
  const filteredSubmissions = useMemo(() => {
    return mockAllSubmissions
      .filter(submission => {
        if (searchTerm) {
          return submission.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 submission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 submission.department.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      })
      .filter(submission => {
        if (departmentFilter !== 'All') {
          return submission.department === departmentFilter;
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
        if (amountRangeFilter !== 'All') {
          const amount = submission.financialImpact;
          switch (amountRangeFilter) {
            case 'Under 1L':
              return amount <= 100000;
            case '1L-3L':
              return amount > 100000 && amount <= 300000;
            case '3L-10L':
              return amount > 300000 && amount <= 1000000;
            case 'Over 10L':
              return amount > 1000000;
            default:
              return true;
          }
        }
        return true;
      })
      .filter(submission => {
        if (approvalLevelFilter !== 'All') {
          return submission.approvalLevel === approvalLevelFilter;
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
  }, [searchTerm, departmentFilter, plantFilter, amountRangeFilter, dateFilter, approvalLevelFilter]);

  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    const allSubmissions = mockAllSubmissions;
    const pendingSubmissions = allSubmissions.filter(s => s.status === 'Pending');
    const approvedSubmissions = allSubmissions.filter(s => s.status === 'Approved');
    const rejectedSubmissions = allSubmissions.filter(s => s.status === 'Rejected');
    
    // Financial thresholds breakdown
    const plantHeadApprovals = pendingSubmissions.filter(s => s.approvalLevel === 'Plant Head');
    const operationsHeadApprovals = pendingSubmissions.filter(s => s.approvalLevel === 'Operations Head');
    const financeHeadApprovals = pendingSubmissions.filter(s => s.approvalLevel === 'Finance Head');
    
    const totalFinancialImpact = allSubmissions.reduce((sum, s) => sum + s.financialImpact, 0);
    
    // Department breakdown
    const departmentStats = ['Production', 'Quality', 'Maintenance', 'Engineering', 'HR', 'Finance'].map(dept => {
      const deptSubmissions = allSubmissions.filter(s => s.department === dept);
      return {
        department: dept,
        total: deptSubmissions.length,
        pending: deptSubmissions.filter(s => s.status === 'Pending').length,
        approved: deptSubmissions.filter(s => s.status === 'Approved').length,
        rejected: deptSubmissions.filter(s => s.status === 'Rejected').length,
        financialImpact: deptSubmissions.reduce((sum, s) => sum + s.financialImpact, 0)
      };
    });
    
    return {
      total: allSubmissions.length,
      pending: pendingSubmissions.length,
      approved: approvedSubmissions.length,
      rejected: rejectedSubmissions.length,
      plantHeadApprovals: plantHeadApprovals.length,
      operationsHeadApprovals: operationsHeadApprovals.length,
      financeHeadApprovals: financeHeadApprovals.length,
      totalFinancialImpact,
      departmentStats
    };
  }, []);

  const getApprovalLevel = (financialImpact: number) => {
    if (financialImpact <= 100000) return 'Plant Head';
    if (financialImpact <= 300000) return 'Operations Head';
    return 'Finance Head';
  };

  const getApprovalLevelColor = (level: string) => {
    switch (level) {
      case 'Plant Head':
        return 'bg-green-100 text-green-800';
      case 'Operations Head':
        return 'bg-blue-100 text-blue-800';
      case 'Finance Head':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (id: string) => {
    console.log('Approve submission:', id);
    alert(`Approved submission: ${id}. This will move to approved submissions.`);
  };

  const handleReject = (id: string) => {
    console.log('Reject submission:', id);
    alert(`Rejected submission: ${id}. This will remain in pending list with rejected status.`);
  };

  const handleExportExcel = () => {
    console.log('Export to Excel');
    alert('Excel export functionality will be implemented with all filters applied');
  };

  const handleExportPDF = () => {
    console.log('Export to PDF');
    alert('PDF export functionality will be implemented with comprehensive reporting');
  };

  const handlePrintForm = (id: string) => {
    console.log('Print Kaizen form:', id);
    alert(`Print formatted Kaizen form for submission: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Crown className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Global Kaizen management with approval workflows and analytics</p>
        </div>

        {/* Main Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Submissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total}</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pending}</div>
              <p className="text-xs text-muted-foreground">Needs workflow approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">≤₹1L (Plant Head)</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.plantHeadApprovals}</div>
              <p className="text-xs text-muted-foreground">Plant head approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">₹1-3L (Operations)</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.operationsHeadApprovals}</div>
              <p className="text-xs text-muted-foreground">Operations head approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">₹3-10L (Finance)</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.financeHeadApprovals}</div>
              <p className="text-xs text-muted-foreground">Finance head approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Approval Workflow Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Approval Workflow System</CardTitle>
            <CardDescription>
              Financial threshold-based approval hierarchy for Kaizen submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border">
                <div>
                  <h4 className="font-medium text-green-900">≤ ₹1 lakh</h4>
                  <p className="text-sm text-green-700">Plant Head Approval</p>
                </div>
                <div className="text-2xl font-bold text-green-600">{metrics.plantHeadApprovals}</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border">
                <div>
                  <h4 className="font-medium text-blue-900">₹1-3 lakhs</h4>
                  <p className="text-sm text-blue-700">Operations Head Approval</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">{metrics.operationsHeadApprovals}</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border">
                <div>
                  <h4 className="font-medium text-purple-900">₹3-10 lakhs</h4>
                  <p className="text-sm text-purple-700">Financial Head Approval</p>
                </div>
                <div className="text-2xl font-bold text-purple-600">{metrics.financeHeadApprovals}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Submissions - Approval Workflow</CardTitle>
                <CardDescription>
                  Review and approve/reject submissions based on financial thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Departments</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Quality">Quality</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
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
                    <Label htmlFor="amount">Amount Range</Label>
                    <Select value={amountRangeFilter} onValueChange={setAmountRangeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Amounts</SelectItem>
                        <SelectItem value="Under 1L">Under ₹1L</SelectItem>
                        <SelectItem value="1L-3L">₹1L - ₹3L</SelectItem>
                        <SelectItem value="3L-10L">₹3L - ₹10L</SelectItem>
                        <SelectItem value="Over 10L">Over ₹10L</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approval">Approval Level</Label>
                    <Select value={approvalLevelFilter} onValueChange={setApprovalLevelFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Levels</SelectItem>
                        <SelectItem value="Plant Head">Plant Head</SelectItem>
                        <SelectItem value="Operations Head">Operations Head</SelectItem>
                        <SelectItem value="Finance Head">Finance Head</SelectItem>
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

                {/* Pending Submissions Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unique ID</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Plant</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Approver Required</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions
                        .filter(s => s.status === 'Pending')
                        .map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                          <TableCell className="font-medium">{submission.operatorName}</TableCell>
                          <TableCell>{submission.department}</TableCell>
                          <TableCell className="max-w-xs truncate">{submission.title}</TableCell>
                          <TableCell>{submission.plant}</TableCell>
                          <TableCell className="font-medium">₹{submission.financialImpact.toLocaleString()}</TableCell>
                          <TableCell>{submission.submissionDate.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={getApprovalLevelColor(submission.approvalLevel!)}>
                              {submission.approvalLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(submission.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(submission.id)}
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredSubmissions.filter(s => s.status === 'Pending').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No pending submissions found matching your filters.</p>
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
                  View all approved Kaizen submissions across all departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unique ID</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Plant</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Approved Level</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions
                        .filter(s => s.status === 'Approved')
                        .map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                          <TableCell className="font-medium">{submission.operatorName}</TableCell>
                          <TableCell>{submission.department}</TableCell>
                          <TableCell className="max-w-xs truncate">{submission.title}</TableCell>
                          <TableCell>{submission.plant}</TableCell>
                          <TableCell className="font-medium">₹{submission.financialImpact.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getApprovalLevelColor(submission.approvalLevel!)}>
                              {submission.approvalLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintForm(submission.id)}
                            >
                              <Printer className="w-4 h-4 mr-1" />
                              Print
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsCharts
              submissions={mockAllSubmissions}
              title="Global Analytics & Insights"
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Reports & Export</CardTitle>
                <CardDescription>
                  Generate comprehensive reports with all applied filters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Export Options</h4>
                    <div className="space-y-3">
                      <Button onClick={handleExportExcel} className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export Global Data to Excel
                      </Button>
                      <Button onClick={handleExportPDF} variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export Comprehensive PDF Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Export Analytics Dashboard
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Bulk Print Options</h4>
                    <div className="space-y-3">
                      <Button onClick={() => handlePrintForm('pending')} variant="outline" className="w-full justify-start">
                        <Printer className="w-4 h-4 mr-2" />
                        Print All Pending Forms
                      </Button>
                      <Button onClick={() => handlePrintForm('approved')} variant="outline" className="w-full justify-start">
                        <Printer className="w-4 h-4 mr-2" />
                        Print All Approved Forms
                      </Button>
                      <Button onClick={() => handlePrintForm('filtered')} variant="outline" className="w-full justify-start">
                        <Printer className="w-4 h-4 mr-2" />
                        Print Filtered Results
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-3">Advanced Report Features</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Global submission summaries with all filters</li>
                      <li>• Department-wise financial impact analysis</li>
                      <li>• Plant-wise performance comparison</li>
                      <li>• Approval workflow efficiency metrics</li>
                    </ul>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Time-series trend analysis</li>
                      <li>• Operator performance rankings</li>
                      <li>• Cost-benefit analysis reports</li>
                      <li>• Custom date range analytics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
