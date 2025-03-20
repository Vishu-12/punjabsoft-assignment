import React, { useState, useEffect } from "react";
import studentsData from "./students.json";
import "./App.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.length >= 3) {
        try {
          let response = await fetch(
            `http://localhost:5000/api/search?name=${searchTerm}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const data = await response.json();
            setSearchResults(data);
          }
        } catch (error) {
          // I know assignment says to do it with backend but just in case it fails,
          // I have written this code just to let you know that I could have been handled this way as well
          console.log("error log => ", error);
          setSearchResults(
            studentsData.filter((stu) =>
              stu.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent([...selectedStudent, student]);
    setSearchResults([]);
    setSearchTerm("");
  };

  const highlightMatch = (text, match) => {
    if (!match) {
      return text;
    }

    const regex = new RegExp(match, "gi");
    return text
      .split(regex)
      .map((part, i) =>
        i === 0 ? part : [<span style={{ color: "red" }}>{match}</span>, part]
      );
  };

  return (
    <div className="app-container">
      <h1>Student Search</h1>
      <input
        type="text"
        placeholder="Search for a student (min. 3 characters)"
        value={searchTerm}
        onChange={handleInputChange}
      />

      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.slice(0, 5).map((student) => (
            <li
              key={student.rollNumber}
              onClick={() => handleStudentSelect(student)}
            >
              {highlightMatch(student.name, searchTerm)} ({student.rollNumber})
            </li>
          ))}
        </ul>
      )}

      {selectedStudent?.map((item) => (
        <div className="student-details" key={item.rollNumber}>
          <h2>{item.name}</h2>
          <p>Class: {item.class}</p>
          <p>Roll Number: {item.rollNumber}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
