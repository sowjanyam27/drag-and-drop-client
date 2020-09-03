import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import "./ImageDetails.css";

export default function ImageDetails({ loadMap, suggestedTags, imageId }) {
  const placeInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [place, setPlace] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async () => {
    const res = await axios
      .post("http://localhost:4000/image", {
        title,
        description,
        tags,
        category,
        place,
        imageId,
      })
      .catch(() => {
        console.log("error");
      });
    if (res) {
      setTitle("");
      setDescription("");
      setTags([]);
      setCategory("");
      setPlace("");
      setIsSubmitted(true);
    }
  };

  const cancelHandler = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setCategory("");
    setPlace("");
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios("http://localhost:4000/category");
      setCategories(response.data); // ...
    }
    fetchData();
  }, []);

  useEffect(() => {
    initPlaceAPI();
  }, [loadMap]);

  // initialize the google place autocomplete
  const initPlaceAPI = () => {
    let autocomplete = new window.google.maps.places.Autocomplete(
      placeInputRef.current
    );
    new window.google.maps.event.addListener(
      autocomplete,
      "place_changed",
      function () {
        let placeOutput = autocomplete.getPlace();
        setPlace(placeOutput.formatted_address);
      }
    );
  };

  const addTags = (event, isSuggestedTag) => {
    if (isSuggestedTag === true) {
      setTags([...tags, event]);
    } else {
      if (event.key === "Enter" && event.target.value !== "") {
        setTags([...tags, event.target.value]);
        event.target.value = "";
      }
    }
  };

  const removeTags = (index) => {
    setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
  };

  return (
    <div className="image-details">
      <h4> 1 foto geselcteerd op te bewerken</h4>
      <form>
        <label for="title">
          <span className="align-left">Titel</span>
          <span className=" align-right">?</span>
        </label>{" "}
        <br />
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          name="title"
          type="text"
          required
          placeholder="Vul een passende titel in voor deze foto"
        />
        <br />
        <label for="description">Gebruikersnaam</label>
        <br />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          name="description"
          id="description"
          type="text"
          required
          placeholder="Geef je foto een korte beschrijving"
        />
        <br />
        {!loadMap ? (
          <div>Loading...</div>
        ) : (
          <div>
            <label for="location">Locatie</label>
            <br />
            <input
              ref={placeInputRef}
              value={place}
              name="location"
              type="text"
              required
              placeholder="Vul in waar seze foto genomen is"
            />
            <br />
          </div>
        )}
        <label for="tags">Tags</label>
        <br />
        <div className="tags-input">
          <ul className="tags">
            {tags.map((tag, index) => (
              <li key={index} className="tag">
                <span className="tag-title">{tag}</span>
                <span
                  className="tag-close-icon"
                  onClick={() => removeTags(index)}
                >
                  x
                </span>
              </li>
            ))}
          </ul>
          <input
            type="text"
            name="tags"
            id="tag-input-form"
            onKeyUp={(event) =>
              event.key === "Enter" ? addTags(event, false) : null
            }
            placeholder="Voeg tags toe"
          />

          <div>
            <hr />

            <ul className="tags">
              {suggestedTags.map((tag, index) => (
                <li key={index} className="tag">
                  <span
                    className="tag-close-icon"
                    onClick={() => addTags(tag, true)}
                  >
                    +
                  </span>
                  <span className="tag-title">{tag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <label for="category">Category</label>
        <br />
        <select
          name="category"
          id="category"
          value={category}
          required
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="" />
          {categories.map((f, i) => (
            <option key={i} value={f.id} label={f.name} />
          ))}
        </select>
        <br />
        <div>
          {isSubmitted ? (
            <span className="align-left submit-button">Submitted</span>
          ) : (
            <span className="align-left submit-button" onClick={handleSubmit}>
              Submit
            </span>
          )}

          <span className="align-right submit-button" onClick={cancelHandler}>
            Anuuleren
          </span>
        </div>
      </form>
    </div>
  );
}