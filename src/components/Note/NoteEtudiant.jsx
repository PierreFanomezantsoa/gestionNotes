import React, { useState } from 'react';

const TableComponent = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Pierre', level: 'L2', grade: 15 },
    { id: 2, name: 'Marie', level: 'L3', grade: 18 },
    { id: 3, name: 'Paul', level: 'M1', grade: 12 }
  ]);

  // L'état pour gérer l'élève à modifier
  const [editingStudent, setEditingStudent] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedLevel, setEditedLevel] = useState('');
  const [editedGrade, setEditedGrade] = useState('');

  // Fonction pour commencer à modifier une ligne
  const handleEdit = (student) => {
    setEditingStudent(student.id);
    setEditedName(student.name);
    setEditedLevel(student.level);
    setEditedGrade(student.grade);
  };

  // Fonction pour enregistrer les modifications
  const handleSave = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === editingStudent
          ? { ...student, name: editedName, level: editedLevel, grade: editedGrade }
          : student
      )
    );
    setEditingStudent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Level</th>
            <th className="py-2 px-4 border-b">Grade</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                {editingStudent === student.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  student.name
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingStudent === student.id ? (
                  <input
                    type="text"
                    value={editedLevel}
                    onChange={(e) => setEditedLevel(e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  student.level
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingStudent === student.id ? (
                  <input
                    type="number"
                    value={editedGrade}
                    onChange={(e) => setEditedGrade(e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  student.grade
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingStudent === student.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
