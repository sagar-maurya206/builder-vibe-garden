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
      <Card className="professional-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-5">
            {data.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700">
                    {item.department || item.plant || item.month}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    {item[dataKey]}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${maxValue > 0 ? (item[dataKey] / maxValue) * 100 : 0}%` }}
                  ></div>
                </div>
                {item.financialImpact && (
                  <div className="text-xs text-slate-500 font-medium">
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
      <Card className="professional-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
              <PieChart className="w-4 h-4 text-violet-600" />
            </div>
            Status Distribution by Department
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-5">
            {data.map((dept, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700">{dept.department}</span>
                  <span className="text-sm font-medium text-slate-600">Total: {dept.total}</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-4 flex overflow-hidden shadow-inner">
                  {dept.approved > 0 && (
                    <div
                      className="bg-emerald-500 h-4 flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${(dept.approved / dept.total) * 100}%` }}
                      title={`Approved: ${dept.approved}`}
                    >
                      {dept.approved > 0 && dept.total > 5 ? dept.approved : ''}
                    </div>
                  )}
                  {dept.pending > 0 && (
                    <div
                      className="bg-amber-500 h-4 flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${(dept.pending / dept.total) * 100}%` }}
                      title={`Pending: ${dept.pending}`}
                    >
                      {dept.pending > 0 && dept.total > 5 ? dept.pending : ''}
                    </div>
                  )}
                  {dept.rejected > 0 && (
                    <div
                      className="bg-red-500 h-4 flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${(dept.rejected / dept.total) * 100}%` }}
                      title={`Rejected: ${dept.rejected}`}
                    >
                      {dept.rejected > 0 && dept.total > 5 ? dept.rejected : ''}
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    Approved: {dept.approved}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                    Pending: {dept.pending}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
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
      <Card className="professional-card border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Total Submissions</CardTitle>
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800 mb-1">{analytics.overall.total}</div>
          <p className="text-sm text-slate-500 font-medium">All time submissions</p>
        </CardContent>
      </Card>

      <Card className="professional-card border-l-4 border-l-emerald-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Approval Rate</CardTitle>
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800 mb-1">{analytics.overall.approvalRate.toFixed(1)}%</div>
          <p className="text-sm text-slate-500 font-medium">
            {analytics.overall.approved} approved of {analytics.overall.total}
          </p>
        </CardContent>
      </Card>

      <Card className="professional-card border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Pending Review</CardTitle>
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800 mb-1">{analytics.overall.pending}</div>
          <p className="text-sm text-slate-500 font-medium">Awaiting approval</p>
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
          <div className="text-3xl font-bold text-slate-800 mb-1">₹{(analytics.overall.financialImpact / 100000).toFixed(1)}L</div>
          <p className="text-sm text-slate-500 font-medium">Total estimated savings</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-md">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h2>
            <p className="text-slate-600 font-medium">Comprehensive analytics and insights</p>
          </div>
        </div>
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

      <Card className="professional-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            Financial Impact Analysis
          </CardTitle>
          <CardDescription className="text-slate-600">
            Financial impact breakdown by department and plant
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-700 mb-4 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Top Departments by Impact
              </h4>
              <div className="space-y-3">
                {analytics.departmentStats
                  .sort((a, b) => b.financialImpact - a.financialImpact)
                  .slice(0, 5)
                  .map((dept, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-semibold text-slate-700">{dept.department}</span>
                      <span className="text-sm font-bold text-slate-800">₹{(dept.financialImpact / 100000).toFixed(1)}L</span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Top Plants by Impact
              </h4>
              <div className="space-y-3">
                {analytics.plantStats
                  .sort((a, b) => b.financialImpact - a.financialImpact)
                  .slice(0, 4)
                  .map((plant, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-semibold text-slate-700">{plant.plant}</span>
                      <span className="text-sm font-bold text-slate-800">₹{(plant.financialImpact / 100000).toFixed(1)}L</span>
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
