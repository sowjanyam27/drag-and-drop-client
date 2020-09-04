import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ImageDetails.css";
import { apiUrl } from "../../config/constants";
import ToolTip from "../ToolTip";

export default function ImageDetails({
  loadMap,
  suggestedTags,
  imageId,
  clear,
}) {
  const placeInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [place, setPlace] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    const res = await axios
      .post(`${apiUrl}/image`, {
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
      // setPlace("");
      setIsSubmitted(true);
      clear(true);
    }
  };

  const cancelHandler = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setCategory("");
    // setPlace("");
    clear(true);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios(`${apiUrl}/category`);
      setCategories(response.data); // ...
    }
    fetchData();
  }, []);

  useEffect(() => {
    initPlaceAPI();
  }, []);

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
        setPlace({ address: placeOutput.formatted_address });
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
        <label htmlFor="title">
          <span className="align-left">Titel</span>
          <span className=" align-right">
            <ToolTip text="Title of the picture" />
          </span>
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
        <label htmlFor="description">
          <span className="align-left">Gebruikersnaam</span>
          <span className=" align-right">
            <ToolTip text="Description of the picture" />
          </span>
        </label>
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
            <label htmlFor="location">
              <span className="align-left">Locatie</span>
              <span className=" align-right">
                <ToolTip text="Location of the picture" />
              </span>
            </label>
            <br />
            <input
              ref={placeInputRef}
              value={place ? place.address : undefined}
              name="location"
              type="text"
              required
              placeholder="Vul in waar seze foto genomen is"
            />
            <br />
          </div>
        )}
        <label htmlFor="tags">
          <span className="align-left">Tags</span>
          <span className=" align-right">
            <ToolTip text="Tags of the picture" />
          </span>
        </label>
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

          <div className="suggested-tags">
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
        <label htmlFor="category">
          <span className="align-left">Categorie</span>
          <span className=" align-right">
            <ToolTip text="Category of the picture" />
          </span>
        </label>
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
            <span
              style={{ background: "green" }}
              className="align-left submit-button"
            >
              submitted
            </span>
          ) : (
            <span className="align-left submit-button" onClick={handleSubmit}>
              Submit
            </span>
          )}
        </div>
      </form>
      <span className="align-right submit-button" onClick={cancelHandler}>
        Anuuleren
      </span>
    </div>
  );
}
