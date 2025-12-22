import React from 'react';
import { useRevenue } from '@/hooks/useRevenue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Revenue: React.FC = () => {
  const {
    period,
    setPeriod,
    totalRevenue,
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
    dateRangeRevenue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoading,
    error,
    fetchRevenueByDateRange,
  } = useRevenue();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: period === 'monthly' ? 'numeric' : undefined,
    });
  };

  const formatWeeklyDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const weekNumber = Math.ceil(day / 7);
    return `${month}/${weekNumber}`;
  };

  const formatMonthlyDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const getChartData = () => {
    if (period === 'daily') {
      return dailyRevenue.map(item => ({
        date: formatDate(item.date),
        revenue: item.revenue / 100,
        fullDate: item.date,
      }));
    } else if (period === 'weekly') {
      return weeklyRevenue.map(item => ({
        date: formatWeeklyDate(item.week),
        revenue: item.revenue / 100,
        fullDate: item.week,
      }));
    } else if (period === 'monthly') {
      return monthlyRevenue.map(item => ({
        date: formatMonthlyDate(item.month),
        revenue: item.revenue / 100,
        fullDate: item.month,
      }));
    }
    return [];
  };

  const getTableData = () => {
    if (period === 'daily') {
      return dailyRevenue;
    } else if (period === 'weekly') {
      return weeklyRevenue.map(item => ({ date: item.week, revenue: item.revenue }));
    } else if (period === 'monthly') {
      return monthlyRevenue.map(item => ({ date: item.month, revenue: item.revenue }));
    }
    return [];
  };

  const handleDateRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
      }
      fetchRevenueByDateRange(startDate, endDate);
    }
  };

  const chartData = getChartData();
  const tableData = getTableData();
  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#07901e',
    },
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-blue">Revenue Analytics</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-green">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        {period === 'range' && dateRangeRevenue && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Selected Range Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-green">
                {formatCurrency(dateRangeRevenue.revenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(dateRangeRevenue.startDate)} - {formatDate(dateRangeRevenue.endDate)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setPeriod('daily')}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            period === 'daily'
              ? 'bg-primary-green text-white'
              : 'bg-gray-light text-text-primary hover:bg-gray-light-medium'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setPeriod('weekly')}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            period === 'weekly'
              ? 'bg-primary-green text-white'
              : 'bg-gray-light text-text-primary hover:bg-gray-light-medium'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            period === 'monthly'
              ? 'bg-primary-green text-white'
              : 'bg-gray-light text-text-primary hover:bg-gray-light-medium'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPeriod('range')}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            period === 'range'
              ? 'bg-primary-green text-white'
              : 'bg-gray-light text-text-primary hover:bg-gray-light-medium'
          }`}
        >
          Custom Range
        </button>
      </div>

      {period === 'range' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDateRangeSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="primaryGreen" size="default">
                Apply
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {period !== 'range' && chartData.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {period === 'daily' && 'Daily Revenue'}
                  {period === 'weekly' && 'Weekly Revenue'}
                  {period === 'monthly' && 'Monthly Revenue'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => `$${Number(value).toLocaleString()}`}
                        />
                      }
                    />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {period !== 'range' && tableData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Revenue Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">
                          {period === 'daily' && 'Date'}
                          {period === 'weekly' && 'Week'}
                          {period === 'monthly' && 'Month'}
                        </th>
                        <th className="text-right p-3 font-semibold">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            {period === 'monthly'
                              ? formatMonthlyDate(item.date)
                              : period === 'weekly'
                              ? formatWeeklyDate(item.date)
                              : formatDate(item.date)}
                          </td>
                          <td className="p-3 text-right font-medium">
                            {formatCurrency(item.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {period === 'range' && dateRangeRevenue && dateRangeRevenue.paymentHistory && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">When</th>
                        <th className="text-right p-3 font-semibold">Amount</th>
                        <th className="text-left p-3 font-semibold">User</th>
                        <th className="text-left p-3 font-semibold">Challenge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dateRangeRevenue.paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            {new Date(payment.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 text-right font-medium">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">
                                {payment.user.first_name} {payment.user.last_name}
                              </div>
                              <div className="text-sm text-text-secondary">
                                {payment.user.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {payment.challenge ? (
                              <div>
                                <div className="font-medium">{payment.challenge.title}</div>
                                <div className="text-sm text-text-secondary">
                                  {payment.challenge.plan} • {payment.challenge.duration} weeks • {payment.challenge.card_size}x{payment.challenge.card_size}
                                </div>
                                <div className="text-xs text-text-secondary mt-1">
                                  Status: {payment.challenge.status}
                                </div>
                              </div>
                            ) : (
                              <span className="text-text-secondary">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {period === 'range' && !dateRangeRevenue && (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-text-secondary">
                  Please select a date range to view revenue
                </p>
              </CardContent>
            </Card>
          )}

          {period !== 'range' && chartData.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-text-secondary">
                  No revenue data available for the selected period
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Revenue;
