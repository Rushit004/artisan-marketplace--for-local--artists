import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from './shared/Card';
import { Spinner } from './shared/Spinner';
import type { ArtisanProfile, DashboardData } from '../types';

interface DashboardProps {
  data: DashboardData | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  if (!data) {
      return <Spinner />;
  }

  const combinedChartData = data.sales.map((item, index) => ({
    ...item,
    profit: data.profit[index]?.profit || 0,
  }));

  const welcomeMessage = "Welcome back!";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-brand-primary">{welcomeMessage}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-brand-accent/30">
              <h4 className="text-sm font-medium text-brand-primary/90">Total Sales (6 mo)</h4>
              <p className="text-3xl font-bold text-brand-primary mt-1">${data.sales.reduce((acc, item) => acc + item.sales, 0).toLocaleString()}</p>
          </Card>
          <Card className="bg-brand-accent/30">
              <h4 className="text-sm font-medium text-brand-primary/90">Total Profit (6 mo)</h4>
              <p className="text-3xl font-bold text-brand-primary mt-1">${data.profit.reduce((acc, item) => acc + item.profit, 0).toLocaleString()}</p>
          </Card>
          <Card className="bg-brand-accent/30">
              <h4 className="text-sm font-medium text-brand-primary/90">Profile Views (4 wks)</h4>
              <p className="text-3xl font-bold text-brand-primary mt-1">{data.engagement.reduce((acc, item) => acc + item.views, 0).toLocaleString()}</p>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Sales & Profit">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#F5EFE6', border: '1px solid #D4B89A' }}/>
                <Legend />
                <Bar dataKey="sales" fill="#4A3F35" name="Sales" />
                <Bar dataKey="profit" fill="#A07D5E" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Weekly Engagement">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data.engagement} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#F5EFE6', border: '1px solid #D4B89A' }}/>
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#4A3F35" strokeWidth={2} name="Profile Views" />
                <Line type="monotone" dataKey="likes" stroke="#A07D5E" strokeWidth={2} name="Likes" />
                <Line type="monotone" dataKey="follows" stroke="#D4B89A" strokeWidth={2} name="New Follows" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};