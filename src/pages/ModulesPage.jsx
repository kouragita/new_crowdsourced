// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom"; // Import useParams

// const ModulesPage = () => {
//   const { learningPathId } = useParams(); // Get the learningPathId from the URL
//   const [modules, setModules] = useState([]);

//   useEffect(() => {
//     // Fetch modules based on the learning path ID
//     axios
//       .get(`https://e-learn-ncux.onrender.com/api/modules?learning_path_id=${learningPathId}`)
//       .then((response) => {
//         setModules(response.data);
//       })
//       .catch((error) => console.error("Error fetching modules:", error));
//   }, [learningPathId]);

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         Modules for Learning Path ID: {learningPathId}
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {modules.length > 0 ? (
//           modules.map((module) => (
//             <div key={module.id} className="bg-white shadow-lg rounded-lg p-4">
//               <h2 className="text-xl font-bold text-gray-700">{module.title}</h2>
//               <p className="text-gray-600">{module.description}</p>
//               <a
//                 href={module.resources[0]?.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 mt-2 inline-block"
//               >
//                 {module.resources[0]?.title}
//               </a>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No modules available for this learning path.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ModulesPage;
