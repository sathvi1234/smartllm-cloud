'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

const mockApiKeys = [
  {
    id: '1',
    name: 'Main API Key',
    key: 'sk_live_1234567890abcdef',
    created: '2024-01-15',
    lastUsed: '2024-07-09',
    rateLimit: 1000,
    usage: 287,
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'sk_test_0987654321fedcba',
    created: '2024-02-01',
    lastUsed: '2024-07-08',
    rateLimit: 100,
    usage: 45,
  },
];

export default function ApiKeysPage() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { addNotification } = useUIStore();

  const toggleVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'API key copied to clipboard',
    });
  };

  const handleDeleteKey = (id: string) => {
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'API key deleted successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="mt-2 text-muted-foreground">Manage your API authentication keys</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Generate Key
        </Button>
      </div>

      {/* Warning */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800/30 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            ⚠️ Never share your API keys. If you believe a key has been compromised, delete it immediately.
          </p>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Your API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-semibold">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono">
                          {visibleKeys.has(apiKey.id)
                            ? apiKey.key
                            : `${apiKey.key.slice(0, 7)}...${apiKey.key.slice(-7)}`}
                        </code>
                        <button
                          onClick={() => toggleVisibility(apiKey.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="size-4 text-muted-foreground" />
                          ) : (
                            <Eye className="size-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{apiKey.created}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{apiKey.lastUsed}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {apiKey.usage}/{apiKey.rateLimit}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyKey(apiKey.key)}
                          className="gap-1"
                        >
                          <Copy className="size-4" />
                          <span className="hidden sm:inline">Copy</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteKey(apiKey.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits Info */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Rate Limiting</CardTitle>
          <CardDescription>How rate limits work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="font-semibold text-sm mb-1">Free Plan</p>
              <p className="text-2xl font-bold">100</p>
              <p className="text-xs text-muted-foreground">requests/minute</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="font-semibold text-sm mb-1">Pro Plan</p>
              <p className="text-2xl font-bold">1,000</p>
              <p className="text-xs text-muted-foreground">requests/minute</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="font-semibold text-sm mb-1">Enterprise</p>
              <p className="text-2xl font-bold">Custom</p>
              <p className="text-xs text-muted-foreground">Contact sales</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
