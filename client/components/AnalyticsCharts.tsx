import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Building,
  DollarSign,
  Users
} from 'lucide-react';

interface SubmissionData {
  id: string;
  operatorName: string;
  department: string;
  plant: string;
  title: string;
  financialImpact: number;
  submissionDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface AnalyticsChartsProps {
  submissions: SubmissionData[];
  title?: string;
  className?: string;
}

export default function AnalyticsCharts({ submissions, title = "Analytics Dashboard", className = "" }: AnalyticsChartsProps) {
  const analytics = useMemo(() => {
    // Department statistics
    const departmentStats = ['Production', 'Quality', 'Maintenance', 'Engineering', 'HR', 'Finance'].map(dept => {
      const deptSubmissions = submissions.filter(s => s.department === dept);
      return {
        department: dept,
        total: deptSubmissions.length,
        pending: deptSubmissions.filter(s => s.status === 'Pending').length,
        approved: deptSubmissions.filter(s => s.status === 'Approved').length,
        rejected: deptSubmissions.filter(s => s.status === 'Rejected').length,
        financialImpact: deptSubmissions.reduce((sum, s) => sum + s.financialImpact, 0)
      };
    }).filter(d => d.total > 0);

    // Plant statistics
    const plantStats = ['Pune', 'Aurangabad', 'Nashik', 'Chennai'].map(plant => {
      const plantSubmissions = submissions.filter(s => s.plant === plant);
      return {
        plant,
        total: plantSubmissions.length,
        pending: plantSubmissions.filter(s => s.status === 'Pending').length,
        approved: plantSubmissions.filter(s => s.status === 'Approved').length,
        rejected: plantSubmissions.filter(s => s.status === 'Rejected').length,
        financialImpact: plantSubmissions.reduce((sum, s) => sum + s.financialImpact, 0)
      };
    }).filter(p => p.total > 0);

    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthSubmissions = submissions.filter(s => {
        const submissionDate = new Date(s.submissionDate);
        return submissionDate.getMonth() === date.getMonth() && 
               submissionDate.getFullYear() === date.getFullYear();
      });
      
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        total: monthSubmissions.length,
        pending: monthSubmissions.filter(s => s.status === 'Pending').length,
        approved: monthSubmissions.filter(s => s.status === 'Approved').length,
        rejected: monthSubmissions.filter(s => s.status === 'Rejected').length,
        financialImpact: monthSubmissions.reduce((sum, s) => sum + s.financialImpact, 0)
      });
    }

    // Overall statistics
    const totalSubmissions = submissions.length;
    const pendingSubmissions = submissions.filter(s => s.status === 'Pending').length;
    const approvedSubmissions = submissions.filter(s => s.status === 'Approved').length;
    const rejectedSubmissions = submissions.filter(s => s.status === 'Rejected').length;
    const totalFinancialImpact = submissions.reduce((sum, s) => sum + s.financialImpact, 0);

    return {
      departmentStats,
      plantStats,
      monthlyTrends,
      overall: {
        total: totalSubmissions,
        pending: pendingSubmissions,
        approved: approvedSubmissions,
        rejected: rejectedSubmissions,
        financialImpact: totalFinancialImpact,
        approvalRate: totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions * 100) : 0
      }
    };
  }, [submissions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const BarChart = ({ data, title, dataKey }: { data: any[], title: string, dataKey: string }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {item.department || item.plant || item.month}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item[dataKey]}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${maxValue > 0 ? (item[dataKey] / maxValue) * 100 : 0}%` }}
                  ></div>
                </div>
                {item.financialImpact && (
                  <div className="text-xs text-gray-500">
                    Impact: ₹{(item.financialImpact / 100000).toFixed(1)}L
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatusDistributionChart = ({ data }: { data: any[] }) => {
    const maxTotal = Math.max(...data.map(d => d.total));
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Status Distribution by Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <span className="text-sm text-gray-600">Total: {dept.total}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
                  {dept.approved > 0 && (
                    <div
                      className="bg-green-500 h-4 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(dept.approved / dept.total) * 100}%` }}
                      title={`Approved: ${dept.approved}`}
                    >
                      {dept.approved > 0 && dept.total > 5 ? dept.approved : ''}
                    </div>
                  )}
                  {dept.pending > 0 && (
                    <div
                      className="bg-yellow-500 h-4 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(dept.pending / dept.total) * 100}%` }}
                      title={`Pending: ${dept.pending}`}
                    >
                      {dept.pending > 0 && dept.total > 5 ? dept.pending : ''}
                    </div>
                  )}
                  {dept.rejected > 0 && (
                    <div
                      className="bg-red-500 h-4 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${(dept.rejected / dept.total) * 100}%` }}
                      title={`Rejected: ${dept.rejected}`}
                    >
                      {dept.rejected > 0 && dept.total > 5 ? dept.rejected : ''}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Approved: {dept.approved}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Pending: {dept.pending}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Rejected: {dept.rejected}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const OverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.overall.total}</div>
          <p className="text-xs text-muted-foreground">All time submissions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.overall.approvalRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {analytics.overall.approved} approved of {analytics.overall.total}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.overall.pending}</div>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Financial Impact</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(analytics.overall.financialImpact / 100000).toFixed(1)}L</div>
          <p className="text-xs text-muted-foreground">Total estimated savings</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          {title}
        </h2>
        <p className="text-gray-600">Comprehensive analytics and insights</p>
      </div>

      <OverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          data={analytics.departmentStats} 
          title="Submissions by Department" 
          dataKey="total" 
        />
        
        <BarChart 
          data={analytics.plantStats} 
          title="Submissions by Plant" 
          dataKey="total" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistributionChart data={analytics.departmentStats} />
        
        <BarChart 
          data={analytics.monthlyTrends} 
          title="Monthly Trends" 
          dataKey="total" 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Impact Analysis
          </CardTitle>
          <CardDescription>
            Financial impact breakdown by department and plant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Top Departments by Impact</h4>
              <div className="space-y-2">
                {analytics.departmentStats
                  .sort((a, b) => b.financialImpact - a.financialImpact)
                  .slice(0, 5)
                  .map((dept, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{dept.department}</span>
                      <span className="text-sm text-gray-600">₹{(dept.financialImpact / 100000).toFixed(1)}L</span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Top Plants by Impact</h4>
              <div className="space-y-2">
                {analytics.plantStats
                  .sort((a, b) => b.financialImpact - a.financialImpact)
                  .slice(0, 4)
                  .map((plant, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{plant.plant}</span>
                      <span className="text-sm text-gray-600">₹{(plant.financialImpact / 100000).toFixed(1)}L</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components
const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
