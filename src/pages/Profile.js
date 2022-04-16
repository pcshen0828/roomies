import React from "react";
import Header from "../components/layout/Header";
import { Firebase } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Tenant() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = React.useState(null);
  function uploadImage() {
    const storageRef = Firebase.ref(Firebase.storage, "users/default/default");
    Firebase.uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  }
  return (
    <>
      <Header />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadImage}>上傳</button>
      <button
        onClick={() => {
          signOut().then(navigate("/"));
        }}
      >
        登出
      </button>
    </>
  );
}

function Landlord() {
  return (
    <>
      <Header />
      landlord
    </>
  );
}

export { Tenant, Landlord };
