import { Card, CardContent } from '@/components/ui/card';
import { MOCK_HISTORY } from '@/constants/mock-data';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">History</h2>
        <p className="text-muted-foreground text-sm">Your last few days at a glance.</p>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border/60 text-muted-foreground border-b text-left text-xs">
                  <th className="px-6 py-3 font-medium">Day</th>
                  <th className="px-6 py-3 font-medium">Calories</th>
                  <th className="px-6 py-3 font-medium">Protein</th>
                  <th className="px-6 py-3 font-medium">Spent</th>
                  <th className="px-6 py-3 font-medium">Meals</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((day) => (
                  <tr key={day.day} className="border-border/60 border-b last:border-0">
                    <td className="px-6 py-3 font-medium">
                      {day.day} <span className="text-muted-foreground">· {day.date}</span>
                    </td>
                    <td className="text-muted-foreground px-6 py-3">
                      {formatCalories(day.calories)}
                    </td>
                    <td className="text-muted-foreground px-6 py-3">
                      {formatGrams(day.proteinGrams)}
                    </td>
                    <td className="text-muted-foreground px-6 py-3">{formatCurrency(day.spent)}</td>
                    <td className="text-muted-foreground px-6 py-3">{day.mealsPlanned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
