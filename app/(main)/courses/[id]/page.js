//import { CourseProgress } from "@/components/course-progress";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { getCourseDetails } from "@/queries/courses";
import CourseDetails from "./_components/CourseDetails";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import Testimonials from "./_components/Testimonials";
const courses = [
  {
    id: 1,
    title: "Design",
    thumbnail: "/assets/images/categories/design.jpg",
  },

  {
    id: 3,
    title: "Development",
    thumbnail: "/assets/images/categories/development.jpg",
  },
  {
    id: 4,
    title: "Marketing",
    thumbnail: "/assets/images/categories/marketing.jpg",
  },
  {
    id: 5,
    title: "IT & Software",
    thumbnail: "/assets/images/categories/it_software.jpg",
  },
  {
    id: 6,
    title: "Personal Development",
    thumbnail: "/assets/images/categories/personal_development.jpg",
  },
  {
    id: 7,
    title: "Business",
    thumbnail: "/assets/images/categories/business.jpg",
  },
  {
    id: 8,
    title: "Photography",
    thumbnail: "/assets/images/categories/photography.jpg",
  },
  {
    id: 9,
    title: "Music",
    thumbnail: "/assets/images/categories/music.jpg",
  },
];
const SingleCoursePage = async ({ params }) => {
  const { id } = await params;
  const course = await getCourseDetails(id);

  return (
    <>
      <CourseDetailsIntro course={course}></CourseDetailsIntro>

      <CourseDetails course={course}></CourseDetails>

      {course?.testimonials && (
        <Testimonials
          testimonials={replaceMongoIdInArray(course?.testimonials)}
        ></Testimonials>
      )}

      {/* <RelatedCourses courses={courses}></RelatedCourses> */}
    </>
  );
};
export default SingleCoursePage;
