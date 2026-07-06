export const MARKETING_FOOD_IMAGES = {
  heroSpread:
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  yogurtBowl:
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  saladBowl:
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  grilledChicken:
    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80',
  paneerTikka:
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  freshIngredients:
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  tableSpread:
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
  happyEating:
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
} as const;

export const MARKETING_MEALS = [
  {
    id: 'breakfast',
    name: 'Greek Yogurt Protein Bowl',
    restaurant: 'The Green Bowl',
    time: '8:00 AM',
    image: MARKETING_FOOD_IMAGES.yogurtBowl,
  },
  {
    id: 'lunch',
    name: 'Grilled Chicken & Quinoa',
    restaurant: 'MealFit Kitchen',
    time: '1:00 PM',
    image: MARKETING_FOOD_IMAGES.grilledChicken,
  },
  {
    id: 'dinner',
    name: 'Paneer Tikka & Brown Rice',
    restaurant: 'Tandoori House',
    time: '8:00 PM',
    image: MARKETING_FOOD_IMAGES.paneerTikka,
  },
] as const;
