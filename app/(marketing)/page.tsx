import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FoodImage } from '@/components/marketing/food-image';
import { MealFoodCard } from '@/components/marketing/meal-food-card';
import { PhoneMockup } from '@/components/marketing/phone-mockup';
import { Reveal } from '@/components/marketing/reveal';
import { MARKETING_FOOD_IMAGES, MARKETING_MEALS } from '@/constants/marketing-food';

const JOURNEY = [
  {
    title: 'Choose your goal',
    description: 'Eat lighter, get more protein, or stay on budget — tell us once.',
    image: MARKETING_FOOD_IMAGES.freshIngredients,
    imageAlt: 'Fresh ingredients on a kitchen counter',
  },
  {
    title: "Get today's meals",
    description: 'We pick real dishes from restaurants near you that fit your day.',
    image: MARKETING_FOOD_IMAGES.saladBowl,
    imageAlt: 'Colorful meal bowl',
  },
  {
    title: 'Order',
    description: 'No more scrolling. Tap to order everything on your plan.',
    image: MARKETING_FOOD_IMAGES.grilledChicken,
    imageAlt: 'Grilled chicken plate',
  },
  {
    title: 'Enjoy your food',
    description: 'Sit down, eat well, and stop wondering if you made the right call.',
    image: MARKETING_FOOD_IMAGES.happyEating,
    imageAlt: 'Beautiful food on a table',
  },
] as const;

const PROMISES = [
  {
    title: 'Know exactly what to order.',
    description: 'Your meals are picked before you even open Swiggy.',
    image: MARKETING_FOOD_IMAGES.yogurtBowl,
    imageAlt: 'Yogurt breakfast bowl',
  },
  {
    title: 'Meals that match your goals.',
    description: 'Eat the way you want — without overthinking every dish.',
    image: MARKETING_FOOD_IMAGES.grilledChicken,
    imageAlt: 'Protein-rich lunch',
  },
  {
    title: 'Eat well without overspending.',
    description: 'Only see options that fit what you want to spend today.',
    image: MARKETING_FOOD_IMAGES.paneerTikka,
    imageAlt: 'Comforting dinner plate',
  },
  {
    title: 'Tell us your goal once. We\'ll handle the rest.',
    description: 'Less deciding, more enjoying — every single day.',
    image: MARKETING_FOOD_IMAGES.tableSpread,
    imageAlt: 'Restaurant table with dishes',
  },
] as const;

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div
          className="from-primary/12 pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] via-transparent to-transparent"
          aria-hidden
        />
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              This makes deciding what to eat easy.
            </h1>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed text-pretty sm:text-xl">
              Nourish plans your meals from real restaurants nearby — so you can stop scrolling
              and start eating.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="group h-12 rounded-2xl px-7 text-base">
                <Link href="/onboarding">
                  Plan Today&apos;s Meals
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl px-7 text-base">
                <Link href="#your-day">See your day</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -top-8 right-0 hidden w-[55%] overflow-hidden rounded-[2rem] lg:block">
              <FoodImage
                src={MARKETING_FOOD_IMAGES.heroSpread}
                alt="Colorful healthy meal spread"
                className="aspect-[5/4] w-full shadow-xl"
                priority
                sizes="400px"
              />
            </div>
            <div className="relative z-10 pt-8 lg:pr-16">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Frustration */}
      <section className="px-6 py-20 sm:py-28">
        <Reveal>
          <div className="bg-primary/10 mx-auto max-w-3xl rounded-[2rem] px-8 py-14 text-center sm:px-14 sm:py-16">
            <p className="text-2xl leading-relaxed font-medium text-balance sm:text-3xl">
              &ldquo;I spend 20 minutes scrolling Swiggy and still don&apos;t know what to
              eat.&rdquo;
            </p>
            <p className="text-muted-foreground mx-auto mt-6 max-w-md text-lg">
              Sound familiar? You&apos;re not alone — and you shouldn&apos;t have to solve dinner
              every night.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Solution */}
      <section className="px-6 pb-20 sm:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <FoodImage
              src={MARKETING_FOOD_IMAGES.tableSpread}
              alt="Shared meal at a restaurant"
              className="aspect-[4/3] w-full rounded-[2rem] shadow-lg"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-lg">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Nourish takes the guesswork out of your day.
              </h2>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
                We learn what you want — then hand-pick breakfast, lunch, and dinner from places
                you already love. Warm, simple, and ready when you are.
              </p>
              <Button asChild size="lg" className="mt-8 h-12 rounded-2xl px-7 text-base">
                <Link href="/onboarding">Find My Meals</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Journey */}
      <section id="your-day" className="scroll-mt-24 bg-primary/5 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Your day, in four easy steps
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                From &ldquo;what should I eat?&rdquo; to &ldquo;that was delicious.&rdquo;
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <div className="flex h-full flex-col">
                  <FoodImage
                    src={step.image}
                    alt={step.imageAlt}
                    className="mb-5 aspect-square w-full rounded-[1.75rem]"
                    sizes="280px"
                  />
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Today's meals showcase */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Meals picked for you — not a menu to browse
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Real food from real restaurants. Already chosen for your day.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {MARKETING_MEALS.map((meal, index) => (
              <Reveal key={meal.id} delay={index * 80}>
                <MealFoodCard
                  name={meal.name}
                  restaurant={meal.restaurant}
                  image={meal.image}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="bg-primary/5 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Food that fits your life
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Less stress. Better meals. More time to actually enjoy them.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {PROMISES.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <div className="border-border/30 bg-card flex flex-col overflow-hidden rounded-[2rem] border sm:flex-row">
                  <FoodImage
                    src={item.image}
                    alt={item.imageAlt}
                    className="aspect-[4/3] w-full sm:aspect-auto sm:w-44 sm:shrink-0 lg:w-52"
                    sizes="208px"
                  />
                  <div className="flex flex-col justify-center p-7">
                    <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 sm:py-28">
        <Reveal>
          <div className="relative mx-auto min-h-[360px] max-w-4xl overflow-hidden rounded-[2.5rem]">
            <FoodImage
              src={MARKETING_FOOD_IMAGES.happyEating}
              alt="Delicious food ready to enjoy"
              className="absolute inset-0 aspect-auto h-full w-full"
              sizes="896px"
            />
            <div className="relative bg-background/85 px-8 py-16 text-center backdrop-blur-[2px] sm:px-14 sm:py-20">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Hungry? Let&apos;s make today easy.
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg">
                Your next great meal is a few taps away — no scrolling required.
              </p>
              <Button asChild size="lg" className="group mt-10 h-12 rounded-2xl px-8 text-base">
                <Link href="/onboarding">
                  Let&apos;s Eat Better
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
