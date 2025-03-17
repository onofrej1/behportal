"use client";
import { getRunEvents } from "@/actions/events";
import { getRuns } from "@/actions/runs";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export default function Events() {
  const { data: events = [], isFetching } = useQuery({
    queryKey: ["getRuns"],
    queryFn: getRunEvents,
  });
  if (isFetching) return;

  return (
    <div>
      {events.map((event) => {
        return (
          <div key={event.id} className="space-y-4">
            {event.name} {formatDate(event.startDate)}
            <div>Attachments: {event._count.attachments}</div>
            <div>Galleries: {event._count.galleries}</div>
            {event.runs.map((run) => (
              <div key={run.id}>
                {run._count.runResults > 0 && (
                  <div>
                    <Link href={`runs/${run.id}/results`}>Vysledky </Link>
                  </div>
                )}
                <Link href={`/manage/runs/${run.id}`}>
                  <Button size={"sm"}>More</Button>
                </Link>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
