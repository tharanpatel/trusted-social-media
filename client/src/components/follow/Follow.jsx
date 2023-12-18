import { useContext, useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import "./follow.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Slider from '@mui/material/Slider';
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

const Follow = ({ setOpenFollow, relationship }) => {
    const { currentUser } = useContext(AuthContext);
    const [trustRating, setTrustRating] = useState({
        trustRating: 50,
        id: relationship?.[0],
    })
    const userId = parseInt(useLocation().pathname.split("/")[2]); // as userId is string but currentUser.id is an int
    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery(
        ["user"],
        () =>
            makeRequest.get("/users/find/" + userId).then((res) => {
                return res.data;
            })
    );

    const handleSlider = (event, newValue) => {
        setTrustRating((prev) => ({ ...prev, trustRating: newValue, id: relationship?.[0] }))
    }

    // Updating relationship with trust rating
    const relationshipMutation = useMutation((relationship) => {
        return makeRequest.put("/relationships", relationship);
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["relationship"]);
            },
        }
    );

    // close modal after clicking set trust
    const handleClick = async (e) => {
        e.preventDefault();
        relationshipMutation.mutate({ ...trustRating });
        setOpenFollow(false);
    }

    // Unfollowing logic
    const unfollowMutation = useMutation(
        () => {
            makeRequest.delete("/relationships?userId=" + userId);;
        },
        {
            onSuccess: () => {
                // Invalidate and refetches user to page autorefreshes and shows new data
                queryClient.invalidateQueries(["relationship"]);
            },
        }
    );

    const handleUnfollow = () => {
        unfollowMutation.mutate(relationship.includes(currentUser.id));
        setOpenFollow(false);
        window.location.reload();
    }

    return (
        <div className="follow">
            <div className="wrapper">
                <h1>How much do you trust {data?.name}?</h1>
                <form>
                    <Slider
                        className="slider"
                        aria-label="trust-rating"
                        value={trustRating.trustRating}
                        defaultValue={50}
                        valueLabelDisplay="auto"
                        track="normal"
                        step={5}
                        marks
                        min={0}
                        max={100}
                        onChange={handleSlider}
                    />
                    <span>You trust {data?.name} with a rating of <span className="trustRating">{trustRating.trustRating}%</span></span>
                    <button onClick={handleClick} type="button">Set trust</button>
                    <button onClick={handleUnfollow} type="button">Unfollow</button>
                </form>
                <button className="close" onClick={() => setOpenFollow(false)}>
                    close
                </button>
            </div>
        </div>
    );
};

export default Follow;