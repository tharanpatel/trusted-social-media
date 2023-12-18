import "./share.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from "../../axios";

const Share = () => {

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(
    ["userShare"],
    () =>
      makeRequest.get("/users/find/" + currentUser.id).then((res) => {
        return res.data;
      })
  );

  const upload = async () => {
    try {
      const formData = new FormData(); // we cannot send file directly to api so we must use formdata
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData);
      return res.data
    } catch (err) {
      console.log(err);
    }
  }

  const queryClient = useQueryClient();

  const mutation = useMutation((newPost) => {
    return makeRequest.post("/posts", newPost);
  },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"])
      },
    }
  );

  const handleClick = async e => {
    e.preventDefault();
    let imgUrl = ""; // if we dont have a file it will just be an empty string
    if (file) imgUrl = await upload();// if we do have a file we will upload it and return its url
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  };

  return (
    <div className="bgContainer">
      <div className="share">
        <div className="container">
          <div className="top">
            <div className="left">
              <img
                src={"/upload/" + data?.profilePic}
                alt=""
              />
              <input
                type="text"
                placeholder={`What's on your mind ${data?.name}?`}
                onChange={e => setDesc(e.target.value)}
                value={desc}
              />
            </div>
            <div className="right">
              {file && <img className="file" alt="" src={URL.createObjectURL(file)} />} {/* Creating a fake image URL for image preview when sharing post with an image */}
            </div>
          </div>
          <hr />
          <div className="bottom">
            <div className="left">
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={e => setFile(e.target.files[0])}
              />
              <label htmlFor="file">
                <div className="item">
                  <img src={Image} alt="" />
                  <span>Add Image</span>
                </div>
              </label>
            </div>
            <div className="right">
              <button onClick={handleClick}>Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;