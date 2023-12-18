// Lamadev (2022) React Social Media App design, Source code, https://github.com/safak/youtube2022/tree/react-social-ui

import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";


const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [postData, setPostData] = useState({
    id: post.id,
    postTrust: post.postTrust,
    trustVoteCount: post.trustVoteCount,
  });
  const { currentUser } = useContext(AuthContext);


  //EXTRACTING API DATA
  const likes = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const positiveTrusts = useQuery(["positiveTrusts", post.id], () =>
    makeRequest.get("/positiveTrusts?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const negativeTrusts = useQuery(["negativeTrusts", post.id], () =>
    makeRequest.get("/negativeTrusts?postId=" + post.id).then((res) => {
      return res.data;
    })
  );


  const queryClient = useQueryClient();

  // MUTATION LOGIC (for likes, positive trust and negative trust)
  const likeMutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const ptMutation = useMutation(
    (isTrusted) => {
      if (isTrusted) return makeRequest.delete("/positiveTrusts?postId=" + post.id);
      return makeRequest.post("/positiveTrusts", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["positiveTrusts"]);
      },
    }
  );

  const ntMutation = useMutation(
    (notTrusted) => {
      if (notTrusted) return makeRequest.delete("/negativeTrusts?postId=" + post.id);
      return makeRequest.post("/negativeTrusts", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["negativeTrusts"]);
      },
    }
  );

  const postMutation = useMutation((post) => {
    return makeRequest.put("/posts?postId=", post);
  },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );


  // HANDLE FUNCTIONS
  const handleLike = () => {
    likeMutation.mutate(likes.data.includes(currentUser.id))
  }

  const handlePositiveTrust = async () => {
    ptMutation.mutate(positiveTrusts.data.includes(currentUser.id))
    if (negativeTrusts.data.includes(currentUser.id)) {
      handleNegativeTrust(); // if user has already disliked the post, the dislike will be removed.
    }
  }

  const handleNegativeTrust = async () => {
    ntMutation.mutate(negativeTrusts.data.includes(currentUser.id))
    if (positiveTrusts.data.includes(currentUser.id)) {
      handlePositiveTrust();
    }
  }

  // DELETING POST LOGIC
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  }


  // want a percentage in the case of high amount of interaction, to improve understanding, provides 
  // most visibiliy to show both total interactions and percentage
  let positiveTrustTotal = positiveTrusts.data?.length;
  let negativeTrustTotal = negativeTrusts.data?.length;
  let totalRatings = positiveTrusts.data?.length + negativeTrusts.data?.length;
  let percentageTrust = 0;

  if (negativeTrustTotal === 0 && positiveTrustTotal === 0) {
    percentageTrust = null;
  } else if (negativeTrustTotal === 0) {
    percentageTrust = 100;
  } else if (positiveTrustTotal === 0 && negativeTrustTotal > 0) { // prevent undefined problem
    percentageTrust = 0;
  } else if (!positiveTrustTotal || !negativeTrustTotal) { // prevent undefined problem
    percentageTrust = null;
  } else {
    percentageTrust = ((positiveTrustTotal / totalRatings) * 100).toPrecision(2);
  }

  const handleTrust = () => {
    setPostData((prev) => ({ ...prev, postTrust: percentageTrust, trustVoteCount: totalRatings }));
  }

  useEffect(() => {
    postMutation.mutateAsync({ ...postData, postTrust: percentageTrust, trustVoteCount: totalRatings });
  }, [percentageTrust])

  // needed for animation to check size of comment section correctly
  const commentsObject = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + post.id).then((res) => {
      return res.data;
    })
  );
  const commentCount = commentsObject.data ? commentsObject.data.length : 0;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="leftSideUserInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">
                  {post.name}
                </span>
              </Link>
              <div className="postDate">
                {moment(post.createdAt).fromNow()}
              </div>
            </div>
          </div>
          <div className="rightSideUserInfo">
            <div className="trustMetric">
              <div className="percentageTrust">
                {
                  percentageTrust === null
                    ? (
                      <span>No ratings</span>
                    ) : (
                      <span>Trust: {percentageTrust}<span>%</span></span>
                    )}
              </div>
              <div className="totalRating">
                {totalRatings > 0 && <span>({totalRatings})</span>}
              </div>
            </div>
            {
              post.userId === currentUser.id &&
              <MoreHorizIcon
                style={{ cursor: "pointer" }}
                onClick={() => setMenuOpen(!menuOpen)}
              />
            }
            {menuOpen && <button onClick={handleDelete}>Delete</button>}
          </div>
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.img !== "" && <img src={"/upload/" + post.img} alt="" />}
        </div>
        <div className="icons">
          <div className="info">
            <div className="item">
              {likes.isLoading ? (
                "Loading"
              ) : likes.data.includes(currentUser.id) ? (
                <motion.div
                  initial={{ opacity: 0, }}
                  animate={{ opacity: 1, rotate: [0, 0, 30, 30, 0], }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, }}
                  animate={{ opacity: 1, rotate: [0, 0, -30, -30, 0], }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FavoriteBorderOutlinedIcon onClick={handleLike} />
                </motion.div>
              )}
              {likes.data?.length}
            </div>
            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              Comments
            </div>
            <div className="item" onClick={() => {
              handlePositiveTrust();
              handleTrust();
            }}>
              {positiveTrusts.isLoading ? (
                "loading"
              ) : positiveTrusts.data.includes(currentUser.id) ? (
                <div className="trustButton">
                  <MoodIcon style={{ color: "green" }} />
                  <span style={{ color: "green" }}>Trustworthy</span>
                </div>
              ) : (
                <div className="trustButton">
                  <MoodIcon />
                  <span>Trustworthy</span>
                </div>
              )}
            </div>
            <div className="item" onClick={() => {
              handleNegativeTrust()
              handleTrust();
            }}>
              {negativeTrusts.isLoading ? (
                "loading"
              ) : negativeTrusts.data.includes(currentUser.id) ? (
                <div className="trustButton">
                  <MoodBadIcon style={{ color: "red" }} />
                  <span style={{ color: "red" }}>Untrustworthy</span>
                </div>
              ) : (
                <div className="trustButton">
                  <MoodBadIcon />
                  <span>Untrustworthy</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <AnimatePresence>
          {commentOpen && (
            <motion.div
              key={commentOpen}
              initial={{ opacity: 0, height: 0, y: (-20 - (20 * commentCount)) }}
              animate={{ opacity: 1, height: (50 + (70 * commentCount)), transition: { duration: 0.5, opacity: { duration: 0.2 } }, y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 1, opacity: { duration: 0.2 } }}
            >
              <Comments postId={post.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  );
};

export default Post;
