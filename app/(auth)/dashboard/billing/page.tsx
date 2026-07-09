'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Download } from 'lucide-react';

const invoices = [
  {
    id: 'INV-2024-07',
    date: '2024-07-01',
    amount: 29.0,
    status: 'paid',
  },
  {
    id: 'INV-2024-06',
    date: '2024-06-01',
    amount: 31.5,
    status: 'paid',
  },
  {
    id: 'INV-2024-05',
    date: '2024-05-01',
    amount: 27.99,
    status: 'paid',
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-2 text-muted-foreground">Manage your subscription and billing settings</p>
      </div>

      {/* Current Plan */}
      <Card className="glass bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <CardDescription>Pro Plan</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Monthly Cost</p>
              <p className="text-2xl font-bold">$29.00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Renewal Date</p>
              <p className="text-2xl font-bold">Aug 1, 2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Billing Cycle</p>
              <p className="text-2xl font-bold">Monthly</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Upgrade to Enterprise
          </Button>
        </CardContent>
      </Card>

      {/* Usage & Limits */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Usage This Month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">API Requests</label>
              <span className="text-sm text-muted-foreground">28,727 / 30,000</span>
            </div>
            <Progress value={95} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Tokens</label>
              <span className="text-sm text-muted-foreground">15.2M / Unlimited</span>
            </div>
            <Progress value={35} />
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-semibold mb-2">Estimated Monthly Cost</p>
            <p className="text-3xl font-bold">$45.87</p>
            <p className="text-xs text-muted-foreground mt-2">
              Actual cost depends on final token usage
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {invoice.status === 'paid' ? (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                          <Check className="mr-1 size-3" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="gap-2">
                        <Download className="size-4" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💳</div>
              <div>
                <p className="font-semibold">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
