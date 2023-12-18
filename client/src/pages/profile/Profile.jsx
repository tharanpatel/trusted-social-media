import "./profile.scss";
import Posts from "../../components/posts/Posts"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import Update from "../../components/update/Update";
import Follow from "../../components/follow/Follow";


const Profile = () => {

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openFollow, setOpenFollow] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]); // as userId is string but currentUser.id is an int

  // query to find id of the relationship between two users in the database

  const { isLoading: relationshipIdLoading, data: relationshipId } = useQuery(
    ["relationship", currentUser.id, userId],
    async () =>
      await makeRequest.get(`/relationships/individualRelationship?followerUserId=${currentUser.id}&followedUserId=${userId}`).then((res) => {
        return res.data;
      })
  );

  const { isLoading, error, data } = useQuery(
    ["user"],
    () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        return res.data;
      })
  );

  const { isLoading: relationshipIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const { isLoading: relationshipTrustLoading, data: relationshipTrust } = useQuery(
    ["relationship", userId],
    async () =>
      await makeRequest.get("/relationships/trust?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    () => {
      if (!relationshipData.includes(currentUser.id))
        makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetches user to page autorefreshes and shows new data
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id))
    setOpenFollow(true);
  }

  // CALCULATING USERS AVERAGE TRUST FOR ALL POSTS
  const postData = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data;
    })
  );

  let totalTrustVoteCount = 0;
  let weightedPostTrust = 0;
  const sumVotes = postData.data?.map(post => {
    if (post.postTrust === null) return; // Ignores posts that havent been voted on
    totalTrustVoteCount = totalTrustVoteCount + post.trustVoteCount;
  })

  const calculateTrustAverage = postData.data?.map(post => {
    if (post.postTrust === null) return;
    weightedPostTrust = weightedPostTrust + ((post.trustVoteCount / totalTrustVoteCount) * post.postTrust);
  })

  // Calculating relationship trust

  let relationshipTrustTotal = 0;
  let noOfRelationships = 0;
  const sumRelationshipTrust = relationshipTrust?.map(relationshipTrust => {
    if (relationshipTrust === null) return; // Ignores posts that havent been voted on
    relationshipTrustTotal = relationshipTrustTotal + relationshipTrust;
    noOfRelationships = noOfRelationships + 1;
  })
  let relationshipTrustAvg = relationshipTrustTotal / noOfRelationships


  const userTrustMutation = useMutation(
    (user) => {
      return makeRequest.patch("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  useEffect(() => {
    if (weightedPostTrust) {
      userTrustMutation.mutate({ id: userId, relationshipTrustSum: relationshipTrustAvg, postTrustSum: weightedPostTrust })
    }

    if (relationshipTrustAvg) {
      userTrustMutation.mutate({ id: userId, relationshipTrustSum: relationshipTrustAvg, postTrustSum: weightedPostTrust })
    }
  }, [weightedPostTrust, relationshipTrustAvg])

  // ADDING FLAG EMOJI
  const clm = require('country-locale-map');
  const userCountryCode = clm.getAlpha2ByName(data?.city);
  const countryEmoji = clm.getCountryByAlpha2(userCountryCode)?.emoji;


  return (
    <div className="profile">
      {isLoading ? "loading..." : <> <div className="images">
        <img
          src={"/upload/" + data.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <div className="info">
                <div className="item">
                  <span>

                  </span>
                </div>
              </div>
            </div>
            <div className="center">
              <span>
                {data.name}
                <span>
                  {data.city} {countryEmoji}
                </span>
              </span>
              {relationshipIsLoading ? (
                "loading"
              ) : userId === currentUser.id ? (
                <button onClick={() => setOpenUpdate(true)}>Update</button>
              ) : (
                // Below shows that if the user profile page being viewed is already being followed, they will already exist in the mysql relationship table
                // and thus the button will show 'Following', if not the button will show '
                <button onClick={handleFollow}>
                  {relationshipData?.includes(currentUser.id)
                    ? "Following"
                    : "Follow"}
                </button>
              )}
            </div>
            <div className="right">
              <div className="rightContainer">
                <h3>Trust Levels</h3>
                <div className="item">
                  {noOfRelationships !== 0 ? (
                    <span>
                      Friends: {(relationshipTrustAvg).toFixed(0)}<span>%</span>
                    </span>
                  ) : (
                    <span>Friends: No friends.</span>
                  )}

                </div>
                <div className="item">
                  {calculateTrustAverage?.length > 0 ? (
                    weightedPostTrust ? (
                      <span>
                        Posts:
                        <span> {(weightedPostTrust).toFixed(0)}<span>%</span></span>
                      </span>
                    ) : (
                      <span>Posts: No ratings.</span>
                    )
                  ) : (
                    <span>Posts: No posts.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Posts userId={userId} />
        </div></>
      }
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      {openFollow && <Follow setOpenFollow={setOpenFollow} relationship={relationshipId} />}
    </div>
  );
};

export default Profile;
