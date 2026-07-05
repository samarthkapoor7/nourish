import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Log in to pick up your plan where you left off.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" disabled />
        </div>
        <Button className="w-full" disabled>
          Log in
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          New to Nourish?{' '}
          <Link
            href="/onboarding"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Get started
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
