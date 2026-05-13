import React, { useEffect, useState } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptConnection,
  getAboutUser,
  getMyConnections,
  getMyConnectionsRequest,
} from "@/config/redux/action/authAction";
import style from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useRouter } from "next/router";

function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(true);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }));
    dispatch(getMyConnections({ token: localStorage.getItem("token") }));
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={style.connectionsContainer}>
          <div className={style.connectionsContainerHeading}>
            {activeTab && (
              <>
                <h4
                  style={{ color: "black" }}
                  className={style.connectionHeading}
                  onClick={() => setActiveTab(true)}>
                  Connection Request's
                </h4>

                <h4
                  className={style.connectionHeading}
                  onClick={() => setActiveTab(false)}>
                  My Connetions
                </h4>
              </>
            )}
            {!activeTab && (
              <>
                <h4
                  className={style.connectionHeading}
                  onClick={() => setActiveTab(true)}>
                  Connection Request's
                </h4>
                <h4
                  style={{ color: "black" }}
                  className={style.connectionHeading}
                  onClick={() => setActiveTab(false)}>
                  My Connetions
                </h4>
              </>
            )}
          </div>

          <div className={style.connectionSubContainer}>
            {activeTab && authState.user ? (
              <div className={style.connectionReq}>
                {authState.connectionRequests.length === 0 ? (
                  <h2>No Connecton Request Pending </h2>
                ) : (
                  <div className="">
                    <hr />
                    <div>
                      <h4>Connection Requests for me</h4>
                      {authState.connectionRequests
                        .filter(
                          (curr) =>
                            curr.connectionId._id === authState.user.userId._id,
                        )
                        .map((user, index) => {
                          return (
                            <div
                              key={user._id}
                              onClick={() =>
                                router.push(
                                  `/view_profile/${user.userId.userName}`,
                                )
                              }
                              className={style.userCard}>
                              <div
                                className=""
                                onClick={() =>
                                  router.push(
                                    `/view_profile/${user.userId.userName}`,
                                  )
                                }>
                                <img
                                  src={`${BASE_URL}/${user.userId.profilePicture}`}
                                  alt="Connection UserImage"
                                />
                                <div className={style.userDetails}>
                                  <h3>{user.userId.name}</h3>
                                  <p>{user.userId.userName}</p>
                                </div>
                              </div>

                              <button
                                // TO DO
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await dispatch(
                                    acceptConnection({
                                      token: localStorage.getItem("token"),
                                      connectionId: user._id,
                                      action: "accept",
                                    }),
                                  );
                                  dispatch(
                                    getMyConnectionsRequest({
                                      token: localStorage.getItem("token"),
                                    }),
                                  );
                                }}
                                className={style.connectedButton}>
                                Accept
                              </button>
                            </div>
                          );
                        })}
                    </div>
                    <hr />

                    <div>
                      <h4>My Sent Connection Requests</h4>
                      {authState.connectionRequests
                        .filter(
                          (curr) =>
                            curr.userId._id === authState.user.userId._id,
                        )
                        .map((user, index) => {
                          return (
                            <div
                              key={user._id}
                              onClick={() =>
                                router.push(
                                  `/view_profile/${user.userId.userName}`,
                                )
                              }
                              className={style.userCard}>
                              <div
                                className=""
                                onClick={() =>
                                  router.push(
                                    `/view_profile/${user.userId.userName}`,
                                  )
                                }>
                                <img
                                  src={`${BASE_URL}/${user.userId.profilePicture}`}
                                  alt="Connection UserImage"
                                />
                                <div className={style.userDetails}>
                                  <h3>{user.userId.name}</h3>
                                  <p>{user.userId.userName}</p>
                                </div>
                              </div>

                              <button
                                className={style.connectedButton}
                                style={{ cursor: "default" }}>
                                Pending
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={style.myConnections}>
                {authState.connections.length === 0 ? (
                  <h2>Don't Have any Connecton's </h2>
                ) : (
                  authState.connections.map((user, index) => {
                    return (
                      <div
                        key={index}
                        className={style.userCard}
                        onClick={() =>
                          router.push(`/view_profile/${user.userName}`)
                        }>
                        <div className="">
                          <img
                            src={`${BASE_URL}/${user.profilePicture}`}
                            alt="Connection UserImage"
                          />
                          <div className={style.userDetails}>
                            <h3>{user.name}</h3>
                            <p>{user.userName}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnectionsPage;
