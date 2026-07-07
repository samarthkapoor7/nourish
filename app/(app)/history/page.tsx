import { Card, CardContent } from '@/components/ui/card';
import { MOCK_HISTORY } from '@/constants/mock-data';
import { formatCalories, formatCurrency, formatGrams } from '@/utils/format';

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">History</h2>
        <p className="text-muted-foreground text-sm">Your recent nutrition and spend snapshots.</p>
      </div>

      <Card className="bg-card rounded-xl ring-1 ring-white/6">
        <CardContent className="p-0 sm:p-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-white/6 text-left text-xs">
                  <th className="px-5 py-3 font-medium">Day</th>
                  <th className="px-5 py-3 font-medium">Calories</th>
                  <th className="px-5 py-3 font-medium">Protein</th>
                  <th className="px-5 py-3 font-medium">Spent</th>
                  <th className="px-5 py-3 font-medium">Meals</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HISTORY.map((day) => (
                  <tr key={day.day} className="border-b border-white/6 last:border-0">
                    <td className="px-5 py-3 font-medium">
                      {day.day} <span className="text-muted-foreground">· {day.date}</span>
                    </td>
                    <td className="text-muted-foreground px-5 py-3">
                      {formatCalories(day.calories)}
                    </td>
                    <td className="text-muted-foreground px-5 py-3">
                      {formatGrams(day.proteinGrams)}
                    </td>
                    <td className="text-muted-foreground px-5 py-3">{formatCurrency(day.spent)}</td>
                    <td className="text-muted-foreground px-5 py-3">{day.mealsPlanned}</td>
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
