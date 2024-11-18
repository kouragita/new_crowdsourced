import React from "react";

const UserDashboard = () => {
  const courses = [
    { id: 1, title: "Introduction to Programming", status: "Enrolled" },
    { id: 2, title: "Data Structures and Algorithms", status: "Enrolled" },
    { id: 3, title: "Web Development", status: "Completed" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800">Your Courses</h3>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <ul>
          {courses.map((course) => (
            <li key={course.id} className="flex justify-between items-center mt-4">
              <span className="text-gray-800">{course.title}</span>
              <span className="text-sm text-gray-600">{course.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
