import { BounceCards } from "@/components/bounce-cards";
import { ClientReviews } from "@/components/client-reviews";
import { FullScreenCalendar } from "@/components/fullscreen-calendar";
import {
  InfoCard,
  InfoCardAction,
  InfoCardContent,
  InfoCardDescription,
  InfoCardDismiss,
  InfoCardFooter,
  InfoCardMedia,
  InfoCardTitle,
} from "@/components/info-card";
import { StackedCardsInteraction } from "@/components/stacked-cards";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const images = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format",
];

const transformStyles = [
  "rotate(5deg) translate(-150px)",
  "rotate(0deg) translate(-70px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(70px)",
  "rotate(-5deg) translate(150px)",
];

function BounceCardsDemo() {
  return (
    <div className="space-y-8">
      <BounceCards
        images={images}
        containerWidth={500}
        containerHeight={500}
        animationDelay={1}
        animationStagger={0.08}
        easeType="elastic.out(1, 0.5)"
        transformStyles={transformStyles}
        className="mx-auto"
      />
    </div>
  );
}

export default function MultiImages() {
  const demoReviews = [
    {
      rating: 5,
      reviewer: "John Doe",
      roleReviewer: "Senior Developer",
      review:
        "Excellent work! The attention to detail and clean code structure really impressed me. Would definitely recommend.",
      date: "2024-03-15",
    },
    {
      rating: 4.5,
      reviewer: "Jane Smith",
      roleReviewer: "Product Manager",
      review:
        "Great communication throughout the project. Delivered everything on time and with high quality.",
      date: "2024-03-14",
    },
    {
      rating: 4.8,
      reviewer: "Mike Johnson",
      roleReviewer: "UI/UX Designer",
      review:
        "Very professional and responsive. The implementation matched our design perfectly.",
      date: "2024-03-13",
    },
  ];

  const dummyEvents = [
    {
      day: new Date("2025-04-02"),
      events: [
        {
          id: 1,
          name: "Q1 Planning Session",
          time: "10:00 AM",
          datetime: "2025-01-02T00:00",
        },
        {
          id: 2,
          name: "Team Sync",
          time: "2:00 PM",
          datetime: "2025-01-02T00:00",
        },
      ],
    },
    {
      day: new Date("2025-04-07"),
      events: [
        {
          id: 3,
          name: "Product Launch Review",
          time: "2:00 PM",
          datetime: "2025-01-07T00:00",
        },
        {
          id: 4,
          name: "Marketing Sync",
          time: "11:00 AM",
          datetime: "2025-01-07T00:00",
        },
        {
          id: 5,
          name: "Vendor Meeting",
          time: "4:30 PM",
          datetime: "2025-01-07T00:00",
        },
      ],
    },
  ];

  return (
    <>
      {/*<BounceCardsDemo />*/}

      <div className="flex h-screen flex-1 flex-col scale-90">
        <FullScreenCalendar data={dummyEvents} />
      </div>

      <ClientReviews reviews={demoReviews} />

      <InfoCard>
        <InfoCardContent>
          <InfoCardTitle>Introducing New Dashboard</InfoCardTitle>
          <InfoCardDescription>
            New Feature. New Platform. Same Feel.
          </InfoCardDescription>
          <InfoCardMedia
            media={[
              {
                src: "https://cd-misc.s3.us-east-2.amazonaws.com/sidebar/third.webp",
              },
              {
                src: "https://cd-misc.s3.us-east-2.amazonaws.com/sidebar/second.webp",
              },
              {
                src: "https://cd-misc.s3.us-east-2.amazonaws.com/sidebar/first.webp",
              },
            ]}
          />
          <InfoCardFooter>
            <InfoCardDismiss>Dismiss</InfoCardDismiss>
            <InfoCardAction>
              <Link
                href="#"
                className="flex flex-row items-center gap-1 underline"
              >
                Try it out <ExternalLink size={12} />
              </Link>
            </InfoCardAction>
          </InfoCardFooter>
        </InfoCardContent>
      </InfoCard>

      <StackedCardsInteraction
        cards={[
          {
            image: "/uploads/img1.jpg",
            title: "Card 1",
            description: "This is the first card",
          },
          {
            image:
              "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Card 2",
            description: "This is the second card",
          },
          {
            image:
              "https://images.unsplash.com/photo-1526827826797-7b05204a22ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8",
            title: "Card 3",
            description: "This is the third card",
          },
        ]}
      />

      <div className="mt-4"></div>
    </>
  );
}
