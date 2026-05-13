import React, { useEffect, useState } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import style from "./index.module.css";
import { useDispatch } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getAllPost } from "@/config/redux/action/postAction";

function ProfileComponent() {
  const dispatch = useDispatch();
  const router = useRouter();

  const postReducer = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);

  const [userPost, setUserPost] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addWorkData, setAddWorkData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const handleAddWorkChange = (e) => {
    const { name, value } = e.target;
    setAddWorkData({ ...addWorkData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPost());
  }, []);

  useEffect(() => {
    setUserProfile(authState.user);
  }, [authState.user]);

  useEffect(() => {
    if (authState.user && postReducer.posts) {
      const filterPosts = postReducer.posts.filter(
        (post) => post.userId._id === authState.user.userId._id,
      );
      setUserPost(filterPosts);
    }
  }, [postReducer.posts, authState.user]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile && userProfile.userId && (
          <div className={style.profileContainer}>
            <div className={style.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={style.backDrop_Overlay}>
                <p>Edit</p>
              </label>
              <input
                hidden
                type="file"
                id="profilePictureUpload"
                onChange={(e) => updateProfilePicture(e.target.files[0])}
              />
              <img
                className={style.backdrop}
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt="Profile Image"
              />
            </div>

            <div className={style.profileContainer_Details}>
              <div className={style.profileContainer_flex}>
                <div className={style.profileContainer_Details_leftBar}>
                  <div className={style.nameAndUserName}>
                    <input
                      type="text"
                      className={style.nameEdit}
                      value={userProfile.userId.name}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        })
                      }
                    />

                    <p style={{ color: "gray" }}>
                      {userProfile.userId.userName}
                    </p>
                  </div>

                  <div>
                    <textarea
                      className={style.profileBio}
                      value={userProfile.bio}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, bio: e.target.value })
                      }
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}></textarea>
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
                                    width: "0",
                                    height: "0",
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
                  <button
                    className={style.addWorkButton}
                    onClick={() => setIsModalOpen(true)}>
                    Add Work
                  </button>
                </div>
              </div>

              {userProfile !== authState.user && (
                <div
                  className={style.connectButton}
                  onClick={(e) => updateProfileData()}>
                  Update Profile
                </div>
              )}
            </div>
          </div>
        )}
        {isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={style.commentsContainer}>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={style.allCommentsContainer}>
              <input
                className={style.inputField}
                name="company"
                type="text"
                placeholder="Enter Company"
                onChange={handleAddWorkChange}
              />
              <input
                className={style.inputField}
                name="position"
                type="text"
                placeholder="Enter position "
                onChange={handleAddWorkChange}
              />
              <input
                className={style.inputField}
                name="years"
                type="number"
                placeholder="Years"
                onChange={handleAddWorkChange}
              />

              <div
                className={style.connectButton}
                onClick={(e) => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, addWorkData],
                  });
                  setIsModalOpen(false);
                }}>
                Add work
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfileComponent;
