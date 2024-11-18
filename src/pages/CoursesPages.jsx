import React from "react";

const CoursesPage = () => {
  const allCourses = [
    { id: 1, title: "Machine Learning", instructor: "Prof. Smith" },
    { id: 2, title: "Blockchain Technology", instructor: "Dr. Johnson" },
    { id: 3, title: "Cloud Computing", instructor: "Prof. Adams" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800">All Courses</h3>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <ul>
          {allCourses.map((course) => (
            <li key={course.id} className="flex justify-between items-center mt-4">
              <span className="text-gray-800">{course.title}</span>
              <span className="text-sm text-gray-600">{course.instructor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoursesPage;
