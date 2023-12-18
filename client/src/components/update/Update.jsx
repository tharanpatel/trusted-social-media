import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {

  const [profilePic, setProfilePic] = useState(null);
  const [texts, setTexts] = useState({
    name: user.name,
    city: user.city,
  });

  const upload = async (file) => {
    try {
      const formData = new FormData(); // we cannot send file directly to api so we must use formdata
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData);
      return res.data
    } catch (err) {
      console.log(err);
    }
  }

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  // Not giving a user ID as we will use JWT token to identify the user
  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let profilePicUrl; // if we dont have a file it will just be an empty string
    profilePicUrl = profilePic ? await upload(profilePic) : user.profilePic;

    mutation.mutate({ ...texts, profilePic: profilePicUrl });
    setOpenUpdate(false);
  }

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <label>Name</label>
          <input
            type="text"
            name="name"
            autoComplete="off"
            onChange={handleChange}
          />
          <label>Country/City</label>
          <input
            type="text"
            name="city"
            autoComplete="off"
            onChange={handleChange}
          />
          <label>Profile picture</label>
          <input
            type="file"
            name="profilePic"
            onChange={e => setProfilePic(e.target.files[0])}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;