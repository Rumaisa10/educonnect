"use client";

import { changeCoursePublishedState, deleteCourse } from "@/app/actions/course";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const CourseActions = ({ courseId, isActive }) => {
  const router = useRouter();
  const [action, setAction] = useState(null);
  const [published, setPublished] = useState(isActive);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      switch (action) {
        case "change-active": {
          const activeState = await changeCoursePublishedState(courseId);

          setPublished(!activeState);
          router.refresh();
          break;
        }

        case "delete": {
          if (published) {
            toast.error("a published lesson cannot be deleted");
          } else {
            await deleteCourse(courseId);
            router.push(`/dashboard/courses`);
          }
          break;
        }

        default: {
          throw new Error("Invalid action");
        }
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAction("change-active")}
        >
          {published ? "Unpublish" : "Publish"}
        </Button>

        <Button size="sm" onClick={() => setAction("delete")}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
