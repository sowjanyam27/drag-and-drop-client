import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import logo from "../../Images/logo.png";

import "./DropZone.css";
import ImageDetails from "../ImageDetails/ImageDetails";
const GOOGLE_MAP_API_KEY = "AIzaSyDWFGqZflQ_Plrv-QJ0tubTKCp-OyaWvME";

const DropZone = () => {
  const fileInputRef = useRef();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState("");
  const [isImageClicked, setImageClicked] = useState(false);
  const [loadMap, setLoadMap] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [imageId, setImageId] = useState("");
  useEffect(() => {
    let filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    setValidFiles([...filteredArr]);
  }, [selectedFiles]);

  const preventDefault = (e) => {
    e.preventDefault();
    // e.stopPropagation();
  };

  const dragOver = (e) => {
    preventDefault(e);
  };

  const dragEnter = (e) => {
    preventDefault(e);
  };

  const dragLeave = (e) => {
    preventDefault(e);
  };

  const fileDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      setImage(e.target.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  };

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
      } else {
        files[i]["invalid"] = true;
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
        setErrorMessage("File type not permitted");
        setUnsupportedFiles((prevArray) => [...prevArray, files[i]]);
      }
    }
  };
  const validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/x-icon",
    ];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }

    return true;
  };

  const imageClick = async () => {
    setImageClicked(true);
  };

  const loadGoogleMapScript = (callback) => {
    if (
      typeof window.google === "object" &&
      typeof window.google.maps === "object"
    ) {
      callback();
    } else {
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener("load", callback);
    }
  };

  const uploadImagetoGetTags = async () => {
    for (let i = 0; i < validFiles.length; i++) {
      const formData = new FormData();

      formData.append("image", validFiles[i]);
      formData.append("key", "");

      const res = await axios
        .post("http://localhost:4000/tags/image", formData)
        .catch(() => {
          console.log("error");
        });
      setSuggestedTags(res.data.labels);
      setImageId(res.data.imageId);
    }
  };

  const getClassName = (className, isImageClicked) => {
    if (!isImageClicked) return className;
    return `${className} ${className}-active`;
  };

  useEffect(() => {
    loadGoogleMapScript(() => {
      setLoadMap(true);
    });
  }, []);

  useEffect(() => {
    if (isImageClicked === true) {
      uploadImagetoGetTags();
    }
  }, [isImageClicked]);

  return (
    <div>
      <div className="split-left left">
        <div className="headline">
          <img src={logo} alt="logo" className="img-responsive align-left" />
          <span className="align-right">Hulp nodig?</span>

          <div style={{ clear: "both" }}></div>
        </div>

        <div className="image-box">
          <div
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
            onClick={fileInputClicked}
            className="dropzone"
          >
            <div className="text-center">
              <div className="circle">+</div>
            </div>
            <input
              ref={fileInputRef}
              className="dropzone-input file-input"
              type="file"
              onChange={filesSelected}
            />
          </div>
          <div>
            {image ? (
              <div>
                <img
                  onClick={imageClick}
                  src={image}
                  alt="pic"
                  className={getClassName("file-img", isImageClicked)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="split-right right">
        {isImageClicked ? (
          <ImageDetails
            loadMap={loadMap}
            suggestedTags={suggestedTags}
            imageId={imageId}
          />
        ) : null}
      </div>
      <br style={{ clear: "both" }} />
    </div>
  );
};

export default DropZone;