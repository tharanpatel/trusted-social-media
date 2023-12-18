import { useQueries, useQuery } from "@tanstack/react-query";
import "./rightBar.scss"
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const RightBar = () => {

  const { currentUser } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  let { isLoading: relationshipIsLoading, data: relationshipData, refetch: relationshipRefetch } = useQuery(
    ["relationshipM"],
    async () =>
      await makeRequest.get("/relationships?followedUserId=" + currentUser.id).then((res) => {
        return res.data;
      }),
  );

  // Array of mutual friend user ID's
  const mfIdArray = useQueries({
    queries: (relationshipData ?? []).map(relationship => {
      return {
        queryKey: ["relationshipArr", relationship],
        queryFn: async () =>
          await makeRequest.get(`/relationships/mutual?followerUserId=${relationship}&currentUserId=${currentUser.id}`).then((res) => {
            return res.data;
          }),
        enabled: !!relationship,
      }
    })
  })

  const mergeArrays = ((mfIdArray ?? [])?.map((q => q?.data))).flat(1);

  const { isLoading: mutualRelationshipIsLoading2, data: mutualRelationshipData2, refetch: mututalRelationShipData2Refetch } = useQuery(
    ["relationshipM3", relationshipData],
    async () =>
      await makeRequest.get(`/relationships/mutual?followerUserId=${relationshipData?.[count + 1]}&currentUserId=${currentUser.id}`).then((res) => {
        return res.data
      }),
    {
      enabled: !!relationshipData,
    }
  );

  // // Array of mutual friends objects
  const mfObjectArray = useQueries({
    queries: (mergeArrays ?? []).map(mutualFriendId => {
      return {
        queryKey: ["mfObjectArray", mutualFriendId],
        queryFn: async () =>
          await makeRequest.get("/users/find/" + mutualFriendId).then((res) => {
            return res.data;
          }),
        enabled: !!mutualFriendId,
      }
    })
  })

  const mutualFriendList = (mfObjectArray)?.map((q => q?.data))

  // sorts mutual friends based on trust
  mutualFriendList.sort((a, b) => (b.relationshipTrustSum > a.relationshipTrustSum) ? 1 : -1)

  const handleClick = async () => {
    if (mergeArrays.length - count >= 2) {
      setCount(count + 2);
    }
    else if (mergeArrays.length - count >= 1) {
      setCount(count + 1);
    }
  }

  const handleReset = async () => {
    console.log("reset count")
    setCount(0);
  }

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <div className="title">Suggestions For You</div>
          {(mutualFriendList.length === 0 && count === 0 && (
            <div className="noFriends">You have no mutual friends at the moment.</div>
          ))}
          {(mutualFriendList[count]) && (
            <div>
              <Link
                to={`/profile/${mutualFriendList[count]?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => { window.location.href = `/profile/${mutualFriendList[count]?.id}` }}
              >
                <div className="user">
                  <div className="userInfo">
                    <img
                      src={"/upload/" + mutualFriendList[count]?.profilePic}
                      alt=""
                    />
                    <div className="rightSideInfo">
                      <span className="name">{mutualFriendList[count]?.name}</span>
                      <div className="trustRatings">
                        <span>Friends trust: {mutualFriendList[count]?.relationshipTrustSum}%</span>
                        <span>Post trust: {mutualFriendList[count]?.postTrustSum}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          {(mutualFriendList[count + 1]) && (
            <div>
              <Link
                to={`/profile/${mutualFriendList[count + 1]?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => { window.location.href = `/profile/${mutualFriendList[count + 1]?.id}` }}
              >
                <div className="user">
                  <div className="userInfo">
                    <img
                      src={"/upload/" + mutualFriendList[count + 1]?.profilePic}
                      alt=""
                    />
                    <div className="rightSideInfo">
                      <span className="name">{mutualFriendList[count + 1]?.name}</span>
                      <div className="trustRatings">
                        <span>Friends trust: {mutualFriendList[count + 1]?.relationshipTrustSum}%</span>
                        <span>Post trust: {mutualFriendList[count + 1]?.postTrustSum}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          {(count >= mergeArrays?.length - 2 && mutualFriendList && mutualFriendList.length !== 0) && (
            <div className="reset">
              <span>You have looked through all your mutual friends!</span>
              <button onClick={handleReset}>Reset</button>
            </div>
          )}
          {count < mergeArrays?.length - 2 && mutualFriendList && (
            <div className="reset">
              <button onClick={handleClick}>Find new suggestions</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RightBar