import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { getCourseDetails } from "@/queries/courses";
import { getLessonBySlug } from "@/queries/lessons";
import LessonVideo from "./_components/lesson-video";
import VideoDescription from "./_components/video-description";

const Course = async ({ params: { id }, searchParams: { name, module } }) => {
  const course = await getCourseDetails(id);
  const allmodules = replaceMongoIdInArray(course.modules).toSorted(
    (a, b) => a.order - b.order
  );
  const defaultLesson = replaceMongoIdInObject(
    allmodules[0].lessonIds?.toSorted((a, b) => a.order - b.order)[0]
  );
  const lessonToPlay = name ? await getLessonBySlug(name) : defaultLesson;

  const defaultModule = module ?? allmodules[0].slug;

  return (
    <div>
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4 w-full">
          <LessonVideo
            courseId={id}
            lesson={lessonToPlay}
            module={defaultModule}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {lessonToPlay.title}
            </h2>
            <Button size="lg">Enroll</Button>
          </div>
          <Separator />
          <VideoDescription description={lessonToPlay?.description} />
        </div>
      </div>
    </div>
  );
};
export default Course;
