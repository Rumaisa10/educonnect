"use client";

import { changeLessonPublishedState, deleteLesson } from "@/app/actions/lesson";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const LessonActions = ({ lesson, moduleId, onDelete }) => {
  const [action, setAction] = useState(null);
  const [published, setPublished] = useState(lesson?.active);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      switch (action) {
        case "change-active": {
          const activeState = await changeLessonPublishedState(lesson.id);
          // assuming activeState is the *new* value from backend:
          setPublished(!activeState);
          break;
        }

        case "delete": {
          if (published) {
            toast.error("a published lesson cannot be deleted");
          } else {
            await deleteLesson(lesson.id, moduleId);
            onDelete();
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
