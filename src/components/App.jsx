import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const API_URL = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setToys(data))
      .catch((error) => console.error(error));
  }, []);

  // Show or hide the toy form
  function handleClick() {
    setShowForm((current) => !current);
  }

  // Increase a toy's likes
  function handleLike(id) {
    const toy = toys.find((toy) => toy.id === id);

    if (!toy) return;

    const updatedLikes = toy.likes + 1;

    setToys((currentToys) =>
      currentToys.map((item) =>
        item.id === id
          ? { ...item, likes: updatedLikes }
          : item
      )
    );

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: updatedLikes }),
    }).catch((error) => console.error(error));
  }

  // Remove a toy
  function handleDelete(id) {
    setToys((currentToys) =>
      currentToys.filter((toy) => toy.id !== id)
    );

    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).catch((error) => console.error(error));
  }

  // Add a new toy
  function handleAddToy(newToy) {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((createdToy) => {
        setToys((currentToys) => [
          ...currentToys,
          { ...createdToy, likes: createdToy.likes ?? 0 },
        ]);
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <Header />

      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onLike={handleLike}
        onDelete={handleDelete}
      />
    </>
  );
}

export default App;