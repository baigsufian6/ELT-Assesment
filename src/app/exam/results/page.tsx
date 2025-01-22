'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FileSearch, UserCheck } from 'lucide-react';

const data = [
  { name: "CMA", value: 25 },
  { name: "ACCA", value: 25 },
  { name: "CPA", value: 25 },
  { name: "CIA", value: 25 }
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

export default function ResultsPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your results based on your answers:</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">
                You are most suitable for:
              </h3>
              <div className="space-y-4">
                <h4 className="text-xl font-bold">
                  Association of Chartered Certified Accountant (ACCA)
                </h4>
                <p className="text-gray-600">
                  Association of Chartered Certified Accountants are professionals who are responsible for the financial 
                  reporting, taxation, and other financial aspects of the business. They have a global reputation and are highly sought after in the 
                  financial world as they make a great impact.
                </p>
                <div className="flex gap-4 mt-6">
                  <Button className="flex items-center gap-2">
                    <FileSearch className="w-4 h-4" />
                    View course details
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Consult Assistant
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-96 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {data.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}