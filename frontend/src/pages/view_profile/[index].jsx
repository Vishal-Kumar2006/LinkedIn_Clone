import { BASE_URL, clientServer } from "@/config";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/UserLayout";
import style from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "@/config/redux/action/postAction";
import {
  sendConnectionRequest,
  getMyConnectionsRequest,
  getAllConnections,
} from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const searchParams = useSearchParams();

  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);

  const [userPost, setUserPost] = useState([]);
  const [currentUserConnection, setCurrentUserConnection] = useState(null);
  const getUserPost = async () => {
    await dispatch(getAllPost());
    await dispatch(getAllConnections({ token: localStorage.getItem("token") }));
  };

  // To set profile post's
  useEffect(() => {
    const filteredPosts = postReducer.posts.filter((post) => {
      return post.userId.userName === router.query.index;
    });

    setUserPost(filteredPosts);
  }, [postReducer.posts]);

  // To set Is the (curr LoggedIn user) is a Profile Connection
  useEffect(() => {
    const connection = authState.all_Connections.find(
      (currConnection) =>
        currConnection.connectionId._id === userProfile.userId._id,
    );

    if (connection) setCurrentUserConnection(connection);
  }, [authState.all_Connections]);

  useEffect(() => {
    getUserPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={style.profileContainer}>
          <div className={style.backDropContainer}>
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>
          <div className={style.profileContainer_Details}>
            <div className={style.profileContainer_flex}>
              <div
                style={{ flex: "0.8" }}
                className={style.profileContainer_Details_leftBar}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "gray" }}>{userProfile.userId.userName}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}>
                  {currentUserConnection == null ? (
                    <button
                      onClick={async () => {
                        await dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            userId: router.query.index,
                          }),
                        );

                        await dispatch(
                          getAllConnections({
                            token: localStorage.getItem("token"),
                          }),
                        );
                      }}
                      className={style.connectButton}>
                      Connect
                    </button>
                  ) : currentUserConnection.statusAccepted === null ? (
                    <button className={style.connectedButton}>Pending</button>
                  ) : (
                    <button className={style.connectedButton}>Connected</button>
                  )}
                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/download_resume?id=${userProfile._id}`,
                      );
                      console.log(response.data.message);
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank",
                      );
                    }}
                    style={{
                      width: "1.2rem",
                      cursor: "pointer",
                    }}>
                    <svg
                      style={{ width: "1.2rem" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <div className={style.viewProfileBio}>
                  <p>{userProfile.bio}</p>
                </div>
              </div>

              <div
                style={{ flex: "0.2" }}
                className={style.profileContainer_Details_rightBar}>
                <h3>Recent Activity</h3>
                {userPost.map((post, index) => {
                  if (index < 3) {
                    return (
                      <div key={post._id} className={style.postCard}>
                        <div className={style.card}>
                          <div className={style.card_profileContainer}>
                            {post.media !== "" ? (
                              <img
                                src={`${BASE_URL}/${post.media}`}
                                alt="Post Image"
                              />
                            ) : (
                              <div
                                style={{
                                  width: "3.4rem",
                                  height: "3.4rem",
                                }}></div>
                            )}
                            <p>{post.body}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            <div className={style.workHistory}>
              <h4>Work History</h4>
              <div className={style.workHistory_Container}>
                {/* {console.log(userProfile)} */}
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={style.workHistory_Card}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}>
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export const getServerSideProps = async (context) => {
  // console.log("From View: View Profile");

  const request = await clientServer.get(
    "/user/get_profile_Based_on_userName",
    {
      params: {
        userName: context.query.index,
      },
    },
  );

  const response = await request.data;
  // console.log(response);
  return { props: { userProfile: request.data.profile } };
};
