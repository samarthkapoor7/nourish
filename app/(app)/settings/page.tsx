import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your profile and nutrition goals.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Basic account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Jane Doe" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" placeholder="jane@example.com" disabled />
          </div>
          <Button disabled>Save changes</Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Nutrition goals</CardTitle>
          <CardDescription>Used to score every recommended meal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily-calories">Daily calories</Label>
              <Input id="daily-calories" placeholder="2,200" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-protein">Daily protein (g)</Label>
              <Input id="daily-protein" placeholder="150" disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily-budget">Daily budget</Label>
            <Input id="daily-budget" placeholder="₹600" disabled />
          </div>
          <Button disabled>Save goals</Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base">Danger zone</CardTitle>
          <CardDescription>Permanently delete your account and all data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Button variant="destructive" disabled>
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
