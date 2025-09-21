import React, { useState, useEffect } from 'react';

const QuizForm = ({ onSubmit, initialData = {}, onCancel, moduleId }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    if (initialData.id) {
      setQuestion(initialData.question || '');
      setOptions(initialData.options ? JSON.parse(initialData.options) : ['', '', '', '']);
      setCorrectAnswer(initialData.correct_answer || '');
    }
  }, [initialData]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ question, options, correct_answer: correctAnswer, module_id: moduleId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question</label>
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Options</label>
        {options.map((opt, index) => (
          <input key={index} type="text" value={opt} onChange={(e) => handleOptionChange(index, e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder={`Option ${index + 1}`} required />
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
        <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter the correct option exactly as written above" required />
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 border rounded-lg">Cancel</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Save Quiz</button>
      </div>
    </form>
  );
};

export default QuizForm;
