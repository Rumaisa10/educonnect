//import { CourseProgress } from "@/components/course-progress";
import { auth } from "@/auth";
import { getEnrollmentsForUser } from "@/queries/enrollments";
import { getUserByEmail } from "@/queries/users";
import Link from "next/link";
import { redirect } from "next/navigation";
import EnrollCourseCard from "../../component/enrolled-coursecard";

async function EnrolledCourses() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const loggedInUser = await getUserByEmail(session?.user?.email);
  const enrollments = await getEnrollmentsForUser(loggedInUser?.id);

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {enrollments && enrollments.length > 0 ? (
        <>
          {enrollments.map((enrollment) => (
            <Link
              key={enrollment?.id}
              href={`/courses/${enrollment.course._id.toString()}/lesson`}
            >
              <EnrollCourseCard enrollment={enrollment}></EnrollCourseCard>
            </Link>
          ))}
        </>
      ) : (
        <p>no enrollments found</p>
      )}
    </div>
  );
}

export default EnrolledCourses;
