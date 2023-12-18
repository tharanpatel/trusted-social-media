import { useContext, useEffect, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../contexts/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading: userIsLoading, error: userError, data: userData } = useQuery(
    ["userComment"],
    () =>
      makeRequest.get("/users/find/" + currentUser.id).then((res) => {
        return res.data;
      })
  );

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"])
      },
    }
  );

  const handleClick = async e => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc(""); // allows us to set comment back to empty string
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + userData?.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc} // allows us to set comment back to empty string
          onChange={e => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "loading"
        : data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={"/upload/" + comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Comments;
